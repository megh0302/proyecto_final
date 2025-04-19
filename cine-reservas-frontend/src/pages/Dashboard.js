import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import axios from 'axios';

function Dashboard() {
    const [rooms, setRooms] = useState([]);
    const [reservationsByRoom, setReservationsByRoom] = useState({});
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const navigate = useNavigate();

    // Obtener la fecha de mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener salas
                const roomsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/rooms`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setRooms(roomsResponse.data);

                // Obtener reservas para cada sala
                const reservationsData = {};
                for (const room of roomsResponse.data) {
                    try {
                        const reservationsResponse = await axios.get(
                            `${process.env.REACT_APP_API_URL}/reservations/${room.id}/${tomorrowDate}`,
                            {
                                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                            }
                        );
                        reservationsData[room.id] = reservationsResponse.data;
                    } catch (error) {
                        reservationsData[room.id] = []; // Si no hay reservas, asumir 0
                    }
                }
                setReservationsByRoom(reservationsData);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    navigate('/');
                } else {
                    console.error('Error fetching data:', error);
                }
            }
        };
        fetchData();
    }, [navigate, tomorrowDate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000); // Actualizar cada segundo
        return () => clearInterval(interval); // Limpiar intervalo al desmontar
    }, []);

    // Calcular asientos disponibles para una sala
    const getAvailableSeats = (room) => {
        const totalSeats = room.seat_rows * room.seat_columns;
        const reservedSeats = (reservationsByRoom[room.id] || []).length;
        return totalSeats - reservedSeats;
    };

    return (
        <div>
            
            <Grid container spacing={2} sx={{ p: 4 }}>
                {rooms.map((room) => (
                    <Grid item xs={12} sm={6} md={4} key={room.id}>
                        <Card class="card">
                            <CardMedia component="img" height="140" image={room.movie_poster} alt={room.movie_title} />
                            <CardContent>
                                <Typography variant="h5">{room.movie_title}</Typography>
                                <Typography>Room: {room.name}</Typography>
                                <Typography>Available Seats: {getAvailableSeats(room)}</Typography>
                                <Button variant="contained" onClick={() => navigate(`/reservation/${room.id}`)}>
                                    Reserve
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default Dashboard;