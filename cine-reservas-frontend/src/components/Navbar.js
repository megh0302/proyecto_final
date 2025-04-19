import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }, []);

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Cinema Reservations
                </Typography>
                {token && (
                    <>
                        <Button color="inherit" onClick={() => navigate('/dashboard')}>
                        </Button>
                        <div className="date-time">
                            <Typography >
                                {currentDateTime.toLocaleString()}
                            </Typography>
                        </div>
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