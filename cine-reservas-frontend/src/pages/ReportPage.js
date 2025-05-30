import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Paper,
    Grid,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';

function ReportPage() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/report`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setReport(response.data);
            } catch (err) {
                setError('No se pudo cargar el reporte.');
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, []);

    if (loading) return <Box sx={{ mt: 10, textAlign: 'center' }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ mt: 10 }}>{error}</Alert>;

    return (
        <Container sx={{ mt: 12 }}>
            <Typography variant="h4" gutterBottom>
                Reporte de Actividad – Próximos 8 días
            </Typography>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1">🎟️ Butacas reservadas:</Typography>
                        <Typography variant="h5" color="primary">{report.seats_reserved}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1">💰 Ingresos totales:</Typography>
                        <Typography variant="h5" color="green">${report.total_income.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1">📉 Ingresos perdidos:</Typography>
                        <Typography variant="h5" color="red">${report.lost_income.toFixed(2)}</Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default ReportPage;
