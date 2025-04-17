import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RoomManagement from './pages/RoomManagement';
import Reservation from './pages/Reservation';
import Navbar from './components/Navbar';
import { Box } from '@mui/material';

function App() {
  return (
    <Router>
      <Navbar />
      <Box sx={{ mt: 8 }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/rooms" element={<RoomManagement />} />
          <Route path="/reservation/:roomId" element={<Reservation />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;