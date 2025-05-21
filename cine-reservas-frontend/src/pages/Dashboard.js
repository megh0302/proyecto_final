import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box
} from '@mui/material';
import axios from 'axios';

function Dashboard() {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/rooms`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setRooms(response.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/');
                }
            }
        };
        fetchRooms();
    }, [navigate]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(to right, #141e30, #243b55)',
                py: 6,
                px: { xs: 2, sm: 4 }
            }}
        >
            <Typography
                variant="h4"
                color="white"
                textAlign="center"
                mb={4}
                fontWeight="bold"
                letterSpacing={1}
            >
                Cartelera de Películas
            </Typography>

            <Grid container spacing={4}>
                {rooms.map((room) => (
                    <Grid item xs={12} sm={6} md={4} key={room.id}>
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: 6,
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.03)',
                                    boxShadow: 10
                                },
                                backgroundColor: '#fefefe'
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={room.movie_poster}
                                alt={room.movie_title}
                                sx={{
                                    width: 200,
                                    height: 300,
                                    objectFit: 'cover',
                                    borderRadius: 2,
                                    mx: 'auto',
                                    mt: 2,
                                    boxShadow: 3
                                }}
                            />
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    textAlign="center"
                                    gutterBottom
                                >
                                    {room.movie_title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                    Sala: {room.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                    Asientos disponibles: {room.seat_rows * room.seat_columns}
                                </Typography>
                                <Box mt={2} textAlign="center">
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate(`/reservation/${room.id}`)}
                                        sx={{
                                            fontWeight: 'bold',
                                            px: 4,
                                            py: 1,
                                            borderRadius: 2
                                        }}
                                    >
                                        Reservar
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Dashboard;
