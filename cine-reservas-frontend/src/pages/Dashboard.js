import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
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
        <Grid container spacing={2} sx={{ p: 4 }}>
            {rooms.map((room) => (
                <Grid item xs={12} sm={6} md={4} key={room.id}>
                    <Card class = "card">
                        <CardMedia component="img" height="140" image={room.movie_poster} alt={room.movie_title} />
                        <CardContent>
                            <Typography variant="h5">{room.movie_title}</Typography>
                            <Typography>Room: {room.name}</Typography>
                            <Typography>Available Seats: {room.seat_rows * room.seat_columns}</Typography>

                           
                            <hr />

                            <Button class = "btn" variant="contained" onClick={() => navigate(`/reservation/${room.id}`)}>
                                Reserve
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default Dashboard;