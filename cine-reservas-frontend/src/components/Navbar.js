import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Cinema Reservations
                </Typography>
                {token && (
                    <>
                        <Button color="inherit" onClick={() => navigate('/dashboard')}>
                            Dashboard
                        </Button>
                        {localStorage.getItem('role') === 'admin' && (
                            <Button color="inherit" onClick={() => navigate('/admin/rooms')}>
                                Manage Rooms
                            </Button>
                        )}
                        <Button color="inherit" onClick={handleLogout}>
                            Log Out
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;