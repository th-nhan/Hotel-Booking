import { Routes, Route, BrowserRouter } from 'react-router-dom';
import RoomMap from './pages/booking/RoomMap';
import BookingPage from './pages/booking/BookingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import HotelDashboard from './pages/admin/HotelDashboard';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import ProfileCustomer from './pages/customer/ProfileCustomer';
import ReviewPage from './pages/customer/Review';
import Heritage from './pages/about/Heritage';
import MenuPreview from './pages/about/MenuPreview';
import ExperienceDetail from './pages/about/ExperienceDetail';
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
          <Route path="/our-menu" element={<MenuPreview />} />
          <Route path="/menu" element={<MenuPreview />} />
          <Route path="/dining-menu" element={<MenuPreview />} />

          {/* Experiences Detail Routes */}
          <Route path="/wellness" element={<ExperienceDetail />} />
          <Route path="/spa" element={<ExperienceDetail />} />
          <Route path="/experiences" element={<ExperienceDetail />} />
          <Route path="/experiences/:slug" element={<ExperienceDetail />} />
          <Route path="/experience/:slug" element={<ExperienceDetail />} />


          {/* ----------------------------ADMIN & RECEPTION-------------------------- */}
          <Route path="/dashboard" element={<HotelDashboard />} />
          <Route path="/receptionist" element={<ReceptionistDashboard />} />


        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
export default App;