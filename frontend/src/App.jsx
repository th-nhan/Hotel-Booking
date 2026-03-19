import { Routes, Route, BrowserRouter } from 'react-router-dom';
import RoomMap from './assets/components/RoomMap'// Component sơ đồ của bạn
import BookingPage from './assets/components/BookingPage';
import Login from './assets/pages/Login';
import Register from './assets/pages/Register';
import Home from './assets/pages/Home';
import HotelDashboard from './assets/pages/admin/HotelDashboard';
import ProfileCustomer from './assets/pages/ProfileCustomer';
import ReviewPage from './assets/pages/Review';
import ScrollToTop from "./assets/components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        <Route path="/room-map" element={<RoomMap />} />
        <Route path="/booking-page" element={<BookingPage />} />

        <Route path="/profile" element={<ProfileCustomer />} />
        <Route path="/reviews" element={<ReviewPage />} />

        {/* ----------------------------ADMIN-------------------------- */}
        <Route path="/dashboard" element={<HotelDashboard />} />


      </Routes>
    </BrowserRouter>
  );
}
export default App;