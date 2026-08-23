import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DonorRegistration from './pages/DonorRegistration';
import SearchDonors from './pages/SearchDonors';
import RequestBlood from './pages/RequestBlood';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import RequestHistory from './pages/RequestHistory';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchDonors />} />
        <Route path="/request-blood/:donorId?" element={<RequestBlood />} />

        {/* Protected Routes (Authenticated Users) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/donor-registration" element={<ProtectedRoute><DonorRegistration /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/request-history" element={<ProtectedRoute><RequestHistory /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
