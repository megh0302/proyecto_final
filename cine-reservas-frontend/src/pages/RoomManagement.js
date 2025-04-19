import { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Alert } from '@mui/material';
import axios from 'axios';

function RoomManagement() {
    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState({ name: '', movie_title: '', movie_poster: '', seat_rows: '', seat_columns: '' });
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState(null);
    const [capacityInputs, setCapacityInputs] = useState({});

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/rooms`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setRooms(response.data);
                setError(null);
            } catch (error) {
                setError(error.response?.data?.message || 'No se pudieron cargar las salas');
            }
        };
        fetchRooms();
    }, []);

    const handleCreateOrUpdate = async () => {
        try {
            const data = {
                ...form,
                seat_rows: parseInt(form.seat_rows) || 0,
                seat_columns: parseInt(form.seat_columns) || 0,
            };
            if (!data.name || !data.movie_title || !data.movie_poster || data.seat_rows <= 0 || data.seat_columns <= 0) {
                setError('Todos los campos son requeridos y las filas/columnas deben ser positivas');
                return;
            }
            if (editId) {
                await axios.put(`${process.env.REACT_APP_API_URL}/rooms/${editId}`, data, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setEditId(null);
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/rooms`, data, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
            }
            setForm({ name: '', movie_title: '', movie_poster: '', seat_rows: '', seat_columns: '' });
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/rooms`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setRooms(response.data);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || 'No se pudo guardar la sala');
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
        setError(null);
    };

    const handleCapacityUpdate = async (id) => {
        const input = capacityInputs[id] || {};
        const seat_rows = parseInt(input.seat_rows) || 0;
        const seat_columns = parseInt(input.seat_columns) || 0;
        if (seat_rows <= 0 || seat_columns <= 0) {
            setError('Las filas y columnas deben ser positivas');
            return;
        }
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
            setCapacityInputs({ ...capacityInputs, [id]: { seat_rows: '', seat_columns: '' } });
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || 'No se pudo actualizar la capacidad');
        }
    };

    const handleDelete = async (id, force = false) => {
        const confirmMessage = force
            ? '¿Estás seguro de que quieres eliminar esta sala y todas sus reservas? ¡Esta acción no se puede deshacer!'
            : '¿Estás seguro de que quieres eliminar esta sala?';
        if (!window.confirm(confirmMessage)) return;
        try {
            const url = force
                ? `${process.env.REACT_APP_API_URL}/rooms/${id}?force=true`
                : `${process.env.REACT_APP_API_URL}/rooms/${id}`;
            await axios.delete(url, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/rooms`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setRooms(response.data);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || 'No se pudo eliminar la sala');
        }
    };

    const handleCapacityInputChange = (id, field, value) => {
        setCapacityInputs({
            ...capacityInputs,
            [id]: {
                ...capacityInputs[id],
                [field]: value,
            },
        });
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Administrar Salas
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <Box sx={{ mb: 4 }}>
                <TextField
                    label="Nombre de la Sala"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Título de la Película"
                    value={form.movie_title}
                    onChange={(e) => setForm({ ...form, movie_title: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="URL del Póster"
                    value={form.movie_poster}
                    onChange={(e) => setForm({ ...form, movie_poster: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Filas"
                    type="number"
                    value={form.seat_rows}
                    onChange={(e) => setForm({ ...form, seat_rows: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Columnas"
                    type="number"
                    value={form.seat_columns}
                    onChange={(e) => setForm({ ...form, seat_columns: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" onClick={handleCreateOrUpdate} sx={{ mt: 2 }}>
                    {editId ? 'Actualizar Sala' : 'Crear Sala'}
                </Button>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Película</TableCell>
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
                            <TableCell>
                                <TextField
                                    type="number"
                                    value={capacityInputs[room.id]?.seat_rows || room.seat_rows}
                                    onChange={(e) => handleCapacityInputChange(room.id, 'seat_rows', e.target.value)}
                                    size="small"
                                    sx={{ width: 80 }}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    value={capacityInputs[room.id]?.seat_columns || room.seat_columns}
                                    onChange={(e) => handleCapacityInputChange(room.id, 'seat_columns', e.target.value)}
                                    size="small"
                                    sx={{ width: 80 }}
                                />
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => handleEdit(room)} sx={{ mr: 1 }}>Editar</Button>
                                <Button onClick={() => handleCapacityUpdate(room.id)} sx={{ mr: 1 }}>
                                    Actualizar Capacidad
                                </Button>
                                
                                <Button
                                    color="error"
                                    variant="outlined"
                                    onClick={() => handleDelete(room.id, true)}
                                >
                                    Eliminar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
}

export default RoomManagement;