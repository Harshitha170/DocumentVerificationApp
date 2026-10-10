import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Unauthorized from './pages/Unauthorized.jsx';
import Register from './pages/Register.jsx';
import Landing from './pages/LandingPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />
        {/*Register*/}
        <Route path="/register" element={<Register/>}  />

        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Regular User Protected Route */}
        <Route element={<ProtectedRoute allowedRole="user" />}>
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>

        {/* Admin Protected Route */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
          
        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      

        {/*Unauthorised*/}
        <Route path = "/unauthorized" element={<Unauthorized />} />

        </Routes>
    </BrowserRouter>
  );
}

export default App;