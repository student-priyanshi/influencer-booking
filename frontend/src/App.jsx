import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import { AppProvider } from './context/AppContext';
import Admin from './pages/Admin/Admin';
import Booking from './pages/Booking';
import Events from './pages/Events';
import Home from './pages/Home';
import Influencers from './pages/Influencers';
import Login from './pages/Login';
import Packages from './pages/Packages';

const AdminGuard = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;
  if (!token || !user || user.role !== 'admin') {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/influencers" element={<Influencers />} />
            <Route path="/events" element={<Events />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/booking/:type/:id" element={<Booking />} />
            <Route path="/admin/*" element={<AdminGuard><Admin /></AdminGuard>} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </AppProvider>
  );
}

export default App;