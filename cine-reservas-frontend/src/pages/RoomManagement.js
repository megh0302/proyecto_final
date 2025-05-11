import { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

function RoomManagement() {
    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState({ name: '', movie_title: '', movie_poster: '', seat_rows: '', seat_columns: '' });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/rooms`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setRooms(response.data);
        };
        fetchRooms();
    }, []);

    const handleCreateOrUpdate = async () => {
        try {
            if (editId) {
                await axios.put(`${process.env.REACT_APP_API_URL}/rooms/${editId}`, form, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setEditId(null);
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/rooms`, form, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
            }
            setForm({ name: '', movie_title: '', movie_poster: '', seat_rows: '', seat_columns: '' });
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/rooms`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setRooms(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEdit = (room) => {
        setForm({
            name: room.name,
            movie_title: room.movie_title,
            movie_poster: room.movie_poster,
            seat_rows: room.seat_rows.toString(),
            seat_columns: room.seat_columns.toString(),
        });
        setEditId(room.id);
    };

    const handleCapacityUpdate = async (id, seat_rows, seat_columns) => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/rooms/${id}/capacity`,
                { seat_rows, seat_columns },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/rooms`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setRooms(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Manage Rooms
            </Typography>
            <Box sx={{ mb: 4 }}>
                <TextField
                    label="Room Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Movie Title"
                    value={form.movie_title}
                    onChange={(e) => setForm({ ...form, movie_title: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Movie Poster URL"
                    value={form.movie_poster}
                    onChange={(e) => setForm({ ...form, movie_poster: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Rows"
                    type="number"
                    value={form.seat_rows}
                    onChange={(e) => setForm({ ...form, seat_rows: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Columns"
                    type="number"
                    value={form.seat_columns}
                    onChange={(e) => setForm({ ...form, seat_columns: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" onClick={handleCreateOrUpdate} sx={{ mt: 2 }}>
                    {editId ? 'Update Room' : 'Create Room'}
                </Button>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Movie</TableCell>
                        <TableCell>Rows</TableCell>
                        <TableCell>Columns</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rooms.map((room) => (
                        <TableRow key={room.id}>
                            <TableCell>{room.name}</TableCell>
                            <TableCell>{room.movie_title}</TableCell>
                            <TableCell>{room.seat_rows}</TableCell>
                            <TableCell>{room.seat_columns}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleEdit(room)}>Edit</Button>
                                <Button onClick={() => handleCapacityUpdate(room.id, room.seat_rows, room.seat_columns)}>Update Capacity</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
}

export default RoomManagement;