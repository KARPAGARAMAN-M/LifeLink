import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// General & Public Pages
import Welcome from './pages/Welcome';
import FindBlood from './pages/FindBlood';
import EmergencyRequestPage from './pages/EmergencyRequestPage';
import TrackRequest from './pages/TrackRequest';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Donor Role Pages
import DonorLogin from './pages/donor/DonorLogin';
import DonorRegister from './pages/donor/DonorRegister';
import DonorDashboard from './pages/donor/DonorDashboard';
import DonorAvailability from './pages/donor/DonorAvailability';
import DonorRequests from './pages/donor/DonorRequests';
import DonorHistory from './pages/donor/DonorHistory';

function App() {
  return (
    <Layout>
      <Routes>
        {/* ===== PUBLIC ROUTES (ZERO-AUTH SEEKER & ANONYMOUS) ===== */}
        <Route path="/" element={<Welcome />} />
        <Route path="/find-blood" element={<FindBlood />} />
        <Route path="/emergency-request" element={<EmergencyRequestPage />} />
        <Route path="/track-request" element={<TrackRequest />} />
        <Route path="/about" element={<Welcome />} />

        {/* ===== DONOR AUTHENTICATION ===== */}
        <Route path="/donor/login" element={<DonorLogin />} />
        <Route path="/donor/register" element={<DonorRegister />} />

        {/* ===== PROTECTED DONOR ROUTES ===== */}
        <Route
          path="/donor/dashboard"
          element={
            <ProtectedRoute allowedRole="DONOR">
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/requests"
          element={
            <ProtectedRoute allowedRole="DONOR">
              <DonorRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/availability"
          element={
            <ProtectedRoute allowedRole="DONOR">
              <DonorAvailability />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/donation-history"
          element={
            <ProtectedRoute allowedRole="DONOR">
              <DonorHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/profile"
          element={
            <ProtectedRoute allowedRole="DONOR">
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ===== LEGACY & ALIAS REDIRECTS ===== */}
        <Route path="/search" element={<Navigate to="/find-blood" replace />} />
        <Route path="/request-blood" element={<Navigate to="/emergency-request" replace />} />
        <Route path="/login" element={<Navigate to="/donor/login" replace />} />
        <Route path="/register" element={<Navigate to="/donor/register" replace />} />
        <Route path="/dashboard" element={<Navigate to="/donor/dashboard" replace />} />
        <Route path="/request-history" element={<Navigate to="/donor/donation-history" replace />} />
        <Route path="/donor-registration" element={<Navigate to="/donor/register" replace />} />
        <Route path="/seeker/*" element={<Navigate to="/find-blood" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
