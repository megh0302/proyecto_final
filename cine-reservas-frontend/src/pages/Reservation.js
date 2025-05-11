import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Button, Modal, TextField, Typography, Box, Container } from '@mui/material'; // Agregado Container
import { QRCodeCanvas } from 'qrcode.react'; // Cambiado de QRCode a QRCodeCanvas
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
                { room_id: roomId, seats: selectedSeats.map((s) => ({ row: s.row, column: s.col })), date },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
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
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Reserve Seats for {room.movie_title} ({room.name})
            </Typography>
            <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputProps={{ inputProps: { min: new Date().toISOString().split('T')[0] } }}
                sx={{ mb: 2 }}
            />
            <Grid container spacing={1}>
                {Array.from({ length: room.seat_rows }).map((_, row) =>
                    Array.from({ length: room.seat_columns }).map((_, col) => {
                        const isReserved = seats.some((seat) => seat.seat_row === row + 1 && seat.seat_column === col + 1);
                        const isSelected = selectedSeats.some((seat) => seat.row === row + 1 && seat.col === col + 1);
                        return (
                            <Grid item key={`${row}-${col}`}>
                                <Button
                                    onClick={() => handleSeatClick(row + 1, col + 1)}
                                    disabled={isReserved}
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        backgroundColor: isReserved ? 'red' : isSelected ? 'blue' : 'green',
                                        '&:hover': { backgroundColor: isReserved ? 'red' : isSelected ? 'blue' : 'limegreen' },
                                    }}
                                >
                                    {`${row + 1}-${col + 1}`}
                                </Button>
                            </Grid>
                        );
                    })
                )}
            </Grid>
            <Button variant="contained" onClick={confirmReservation} disabled={selectedSeats.length === 0} sx={{ mt: 2 }}>
                Confirm Reservation
            </Button>
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'white', p: 4, borderRadius: 2 }}>
                    <Typography variant="h6">Enter Card Details</Typography>
                    <TextField
                        label="Card Number"
                        fullWidth
                        margin="normal"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    />
                    <TextField
                        label="Expiry Date"
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
                    <QRCodeCanvas // Cambiado de QRCode a QRCodeCanvas
                        id="qrCode"
                        value={JSON.stringify({ roomId, seats: selectedSeats, date, movie: room.movie_title })}
                        size={200}
                    />
                    <Button variant="contained" onClick={downloadQR} sx={{ mt: 2 }}>
                        Confirm and Download QR
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
}

export default Reservation;