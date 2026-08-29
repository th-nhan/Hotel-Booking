import { Routes, Route, BrowserRouter } from 'react-router-dom';
import RoomMap from './pages/booking/RoomMap';
import BookingPage from './pages/booking/BookingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import HotelDashboard from './pages/admin/HotelDashboard';
import ProfileCustomer from './pages/customer/ProfileCustomer';
import ReviewPage from './pages/customer/Review';
import Heritage from './pages/Heritage';
import ScrollToTop from './components/layout/ScrollToTop';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
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
          <Route path="/heritage" element={<Heritage />} />
          <Route path="/our-story" element={<Heritage />} />
          

          {/* ----------------------------ADMIN-------------------------- */}
          <Route path="/dashboard" element={<HotelDashboard />} />


        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
export default App;