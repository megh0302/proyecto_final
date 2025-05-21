import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Paper
} from '@mui/material';
import axios from 'axios';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
                username,
                password
            });
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || 'Error al registrarse');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to right, #43cea2, #185a9d)',
                fontFamily: 'Inter, sans-serif'
            }}
        >
            <Container maxWidth="sm">
                <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
                        Crear Cuenta
                    </Typography>
                    {error && (
                        <Typography color="error" align="center" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <TextField
                        label="Usuario"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                    />
                    <TextField
                        label="Contraseña"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
                        onClick={handleRegister}
                    >
                        Registrarse
                    </Button>
                    <Button
                        fullWidth
                        sx={{ mt: 2, py: 1.5 }}
                        onClick={() => navigate('/')}
                    >
                        ¿Ya tienes cuenta? Inicia sesión
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
}

export default Register;
