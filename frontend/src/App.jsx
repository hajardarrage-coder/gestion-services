import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDemandesPage from './pages/admin/DemandesPage';
import AdminStudentsPage from './pages/admin/StudentsPage';
import AdminPersonnelPage from './pages/admin/PersonnelPage';
import AdminBuildingsPage from './pages/admin/BuildingsPage';
import ServiceAccountsPage from './pages/admin/ServiceAccountsPage';
import PresidentDashboard from './pages/president/PresidentDashboard';
import PresidentDemandesPage from './pages/president/PresidentDemandesPage';
import ServiceDashboard from './pages/service/ServiceDashboard';
import ServiceDemandesPage from './pages/service/ServiceDemandesPage';
import StudentDashboard from './pages/student/StudentDashboard';
import ProtectedLayout from './components/layout/ProtectedLayout';
import axios from 'axios';

// Backend API Global Configuration
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin area */}
      <Route element={<ProtectedLayout allowedRoles={['admin']} />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/demandes" element={<AdminDemandesPage />} />
        <Route path="/admin/etudiants" element={<AdminStudentsPage />} />
        <Route path="/admin/personnel" element={<AdminPersonnelPage />} />
        <Route path="/admin/batiments" element={<AdminBuildingsPage />} />
        <Route path="/admin/enseignants" element={<Navigate to="/admin/personnel" replace />} />
        <Route path="/admin/services" element={<ServiceAccountsPage />} />
      </Route>

      {/* President area */}
      <Route element={<ProtectedLayout allowedRoles={['president']} />}>
        <Route path="/president" element={<Navigate to="/president/dashboard" replace />} />
        <Route path="/president/dashboard" element={<PresidentDashboard />} />
        <Route path="/president/demandes" element={<PresidentDemandesPage />} />
      </Route>

      {/* Service area */}
      <Route element={<ProtectedLayout allowedRoles={['service']} />}>
        <Route path="/service" element={<Navigate to="/service/dashboard" replace />} />
        <Route path="/service/dashboard" element={<ServiceDashboard />} />
        <Route path="/service/demandes" element={<ServiceDemandesPage />} />
      </Route>

      {/* Student area */}
      <Route element={<ProtectedLayout allowedRoles={['student']} />}>
        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

