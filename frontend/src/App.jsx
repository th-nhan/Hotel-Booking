import { Routes, Route } from 'react-router-dom';
import RoomMap from './assets/components/RoomMap'// Component sơ đồ của bạn
import BookingPage from './assets/components/BookingPage';  
import Login from './assets/pages/Login';
import Register from './assets/pages/Register';
import Home from './assets/pages/Home';
import HotelDashboard from './assets/pages/admin/HotelDashboard';
import ProfileCustomer from './assets/pages/ProfileCustomer';



function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        <Route path="/room-map" element={<RoomMap />} />
        <Route path="/booking-page" element={<BookingPage />} />

        <Route path="/dashboard" element={<HotelDashboard/>} />
        <Route path="/profile" element={<ProfileCustomer/>} />

        
      </Routes>
  );
}
export default App;