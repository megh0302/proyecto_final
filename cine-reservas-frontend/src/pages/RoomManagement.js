import { useState, useEffect } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Stack
} from '@mui/material';
import axios from 'axios';

function RoomManagement() {
    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState({ name: '', movie_title: '', movie_poster: '', seat_rows: '', seat_columns: '' });
    const [editId, setEditId] = useState(null);

    const fetchRooms = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/rooms`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setRooms(response.data);
    };

    useEffect(() => {
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
            fetchRooms();
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
            fetchRooms();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 6 }}>
            <Typography variant="h4" textAlign="center" gutterBottom fontWeight="bold">
                Gestión de Salas de Cine
            </Typography>

            <Paper elevation={4} sx={{ p: 4, mb: 5, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    {editId ? 'Editar Sala' : 'Crear Nueva Sala'}
                </Typography>
                <Stack spacing={2}>
                    <TextField
                        label="Nombre de la Sala"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Título de la Película"
                        value={form.movie_title}
                        onChange={(e) => setForm({ ...form, movie_title: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="URL del Póster"
                        value={form.movie_poster}
                        onChange={(e) => setForm({ ...form, movie_poster: e.target.value })}
                        fullWidth
                    />
                    <Box display="flex" gap={2}>
                        <TextField
                            label="Filas"
                            type="number"
                            value={form.seat_rows}
                            onChange={(e) => setForm({ ...form, seat_rows: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Columnas"
                            type="number"
                            value={form.seat_columns}
                            onChange={(e) => setForm({ ...form, seat_columns: e.target.value })}
                            fullWidth
                        />
                    </Box>
                    <Button variant="contained" size="large" onClick={handleCreateOrUpdate}>
                        {editId ? 'Actualizar Sala' : 'Crear Sala'}
                    </Button>
                </Stack>
            </Paper>

            <Paper elevation={3} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell fontWeight="bold">Nombre</TableCell>
                            <TableCell>Pelicula</TableCell>
                            <TableCell>Filas</TableCell>
                            <TableCell>Columnas</TableCell>
                            <TableCell>Acciones</TableCell>
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
                                    <Stack direction="row" spacing={1}>
                                        <Button variant="outlined" onClick={() => handleEdit(room)}>
                                            Editar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleCapacityUpdate(room.id, room.seat_rows, room.seat_columns)}
                                        >
                                            Actualizar Capacidad
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}

export default RoomManagement;
