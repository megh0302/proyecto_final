import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Cambiado de import default a import nombrado

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
            const decoded = jwtDecode(token); // Usamos jwtDecode correctamente
            localStorage.setItem('role', decoded.role);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                    label="Username"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" onClick={handleLogin} sx={{ mt: 2 }}>
                    Login
                </Button>
                <Button onClick={() => navigate('/register')} sx={{ mt: 2, ml: 2 }}>
                    Create Account
                </Button>
            </Box>
        </Container>
    );
}

export default Login;