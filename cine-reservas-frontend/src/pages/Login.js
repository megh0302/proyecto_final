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
import { jwtDecode } from 'jwt-decode';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { username, password });
            const token = response.data.token;
            localStorage.setItem('token', token);
            const decoded = jwtDecode(token);
            localStorage.setItem('role', decoded.role);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to right, #667eea, #764ba2)',
                fontFamily: 'Inter, sans-serif'
            }}
        >
            <Container maxWidth="sm">
                <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
                        Iniciar Sesión
                    </Typography>
                    {error && <Typography color="error" align="center">{error}</Typography>}
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
                        sx={{ mt: 3, mb: 1, py: 1.5, fontWeight: 'bold' }}
                        onClick={handleLogin}
                    >
                        Entrar
                    </Button>
                    <Button
                        fullWidth
                        sx={{ py: 1.5 }}
                        onClick={() => navigate('/register')}
                    >
                        Crear Cuenta
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
}

export default Login;
