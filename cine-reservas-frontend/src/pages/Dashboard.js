import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import axios from 'axios';

function Dashboard() {
    const [rooms, setRooms] = useState([]);
    const [reservationsByRoom, setReservationsByRoom] = useState({});
    const navigate = useNavigate();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const roomsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/rooms`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setRooms(roomsResponse.data);

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
                        reservationsData[room.id] = [];
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

    const getAvailableSeats = (room) => {
        const totalSeats = room.seat_rows * room.seat_columns;
        const reservedSeats = (reservationsByRoom[room.id] || []).length;
        return totalSeats - reservedSeats;
    };

    return (
        <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                Dashboard - Movie Reservations
            </Typography>
            <Grid container spacing={4} sx={{ px: 4, justifyContent: 'center' }}>
                {rooms.map((room) => (
                    <Grid item xs={12} sm={6} md={3} key={room.id}>
                        <Card class="card">
                            <CardMedia
                                component="img"
                                height="200"
                                image={room.movie_poster}
                                alt={room.movie_title}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {room.movie_title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Room: {room.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Available Seats: {getAvailableSeats(room)}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    class="btn-reserve"
                                    onClick={() => navigate(`/reservation/${room.id}`)}
                                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                >
                                    Reserve
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Dashboard;
