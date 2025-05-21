import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    useTheme
} from '@mui/material';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const theme = useTheme();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <AppBar
            position="fixed"
            elevation={3}
            sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderBottom: `1px solid ${theme.palette.divider}`
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                    variant="h6"
                    onClick={() => navigate('/')}
                    sx={{
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        '&:hover': {
                            color: theme.palette.primary.main
                        }
                    }}
                >
                    Cinema Reserva
                </Typography>

                {token && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="text"
                            onClick={() => navigate('/dashboard')}
                            sx={{ fontWeight: 500 }}
                        >
                            Dashboard
                        </Button>

                        {role === 'admin' && (
                            <Button
                                variant="text"
                                onClick={() => navigate('/admin/rooms')}
                                sx={{ fontWeight: 500 }}
                            >
                                Administrar Salas
                            </Button>
                        )}

                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleLogout}
                            sx={{ fontWeight: 500 }}
                        >
                            Cerrar Sesión
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
