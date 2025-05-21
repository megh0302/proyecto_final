import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Grid,
    Button,
    Modal,
    TextField,
    Typography,
    Box,
    Container
} from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';

function Reservation() {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [openModal, setOpenModal] = useState(false);
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/rooms`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                const room = response.data.find((r) => r.id === parseInt(roomId));
                setRoom(room);
            } catch (error) {
                navigate('/dashboard');
            }
        };

        const fetchSeats = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/reservations/${roomId}/${date}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setSeats(response.data);
            } catch (error) {
                console.error('Error fetching seats:', error);
            }
        };

        fetchRoom();
        fetchSeats();
    }, [roomId, date, navigate]);

    const handleSeatClick = (row, col) => {
        const isReserved = seats.some((seat) => seat.seat_row === row && seat.seat_column === col);
        if (!isReserved) {
            const isSelected = selectedSeats.some((seat) => seat.row === row && seat.col === col);
            if (isSelected) {
                setSelectedSeats(selectedSeats.filter((seat) => !(seat.row === row && seat.col === col)));
            } else {
                setSelectedSeats([...selectedSeats, { row, col }]);
            }
        }
    };

    const confirmReservation = async () => {
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/reservations`,
                {
                    room_id: roomId,
                    seats: selectedSeats.map((s) => ({ row: s.row, column: s.col })),
                    date,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );
            setOpenModal(true);
        } catch (error) {
            console.error('Error creating reservation:', error);
        }
    };

    const downloadQR = () => {
        const canvas = document.getElementById('qrCode');
        const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `reservation-${roomId}-${date}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        setOpenModal(false);
        navigate('/dashboard');
    };

    if (!room) return null;

    return (
        <Container sx={{ mt: 4, pb: 6 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
                Reservar Asientos - {room.movie_title} ({room.name})
            </Typography>

            <TextField
                label="Fecha"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputProps={{ inputProps: { min: new Date().toISOString().split('T')[0] } }}
                sx={{ mb: 3 }}
                fullWidth
            />

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${room.seat_columns}, 60px)`,
                    justifyContent: 'center',
                    gap: 1,
                    background: '#red',
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    mb: 2,
                }}
            >
                {Array.from({ length: room.seat_rows }).map((_, row) =>
                    Array.from({ length: room.seat_columns }).map((_, col) => {
                        const r = row + 1;
                        const c = col + 1;
                        const isReserved = seats.some((seat) => seat.seat_row === r && seat.seat_column === c);
                        const isSelected = selectedSeats.some((seat) => seat.row === r && seat.col === c);

                        return (
                            <Button
                                key={`${r}-${c}`}
                                onClick={() => handleSeatClick(r, c)}
                                disabled={isReserved}
                                variant="contained"
                                sx={{
                                    width: 55,
                                    height: 55,
                                    backgroundColor: isReserved
                                        ? '#e74c3c'
                                        : isSelected
                                        ? '#2980b9'
                                        : '#2ecc71',
                                    color: isReserved || isSelected ? 'white' : 'black',
                                    fontWeight: 'bold',
                                    fontSize: 12,
                                    '&:hover': {
                                        backgroundColor: isReserved
                                            ? '#c0392b'
                                            : isSelected
                                            ? '#1f618d'
                                            : '#27ae60',
                                    },
                                }}
                            >
                                {r}-{c}
                            </Button>
                        );
                    })
                )}
            </Box>

            {/* Leyenda visual */}
            <Box textAlign="center" mb={3}>
                <Typography variant="body2" sx={{ display: 'inline', mx: 2 }}>
                    🟥 Reservado
                </Typography>
                <Typography variant="body2" sx={{ display: 'inline', mx: 2 }}>
                    🟦 Seleccionado
                </Typography>
                <Typography variant="body2" sx={{ display: 'inline', mx: 2 }}>
                    🟩 Disponible
                </Typography>
            </Box>

            <Box textAlign="center">
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={selectedSeats.length === 0}
                    onClick={confirmReservation}
                    sx={{ px: 4, py: 1.5, fontWeight: 'bold', fontSize: 16 }}
                >
                    Confirmar Reservación
                </Button>
            </Box>

            {/* Modal con QR y datos de tarjeta */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        p: 4,
                        borderRadius: 3,
                        boxShadow: 24,
                        width: { xs: '90%', sm: 400 },
                    }}
                >
                    <Typography variant="h6" mb={2} textAlign="center" fontWeight="bold">
                        Ingresar detalles de tarjeta
                    </Typography>
                    <TextField
                        label="Número de tarjeta"
                        fullWidth
                        margin="normal"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    />
                    <TextField
                        label="Fecha de expiración"
                        fullWidth
                        margin="normal"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    />
                    <TextField
                        label="CVV"
                        fullWidth
                        margin="normal"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    />
                    <Box display="flex" justifyContent="center" mt={3}>
                        <QRCodeCanvas
                            id="qrCode"
                            value={JSON.stringify({ roomId, seats: selectedSeats, date, movie: room.movie_title })}
                            size={180}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3, py: 1.2, fontWeight: 'bold' }}
                        onClick={downloadQR}
                    >
                        Confirmar y Descargar QR
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
}

export default Reservation;
