import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DashboardPage from '../pages/Dashboard/Dashboard';
import VehicleListPage from '../pages/Vehicles/VehicleListPage';
import RentalPage from '../pages/Rental/RentalListPage';
import RentalUserPage from '../pages/Rental/RentalUser';
import UserPage from '../pages/ListUser/ListUserPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ShowVehiclePage from '../pages/Vehicles/ShowVehiclePage';

export default function AppRoutes() {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // Daftar URL yang boleh diakses tanpa login
  const publicPaths = ['/', '/register'];

  const isPublic = publicPaths.includes(location.pathname);

  if (!token && !isPublic) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/vehicle" element={<VehicleListPage />} />
      <Route path="/rental" element={<RentalPage />} />
      <Route path="/rentaluser" element={<RentalUserPage />} />
      <Route path="/users" element={<UserPage />} />
      <Route path="/listvehicle" element={<ShowVehiclePage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
