import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // 1. If no token exists, send to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Safe, case-insensitive role check
  if (allowedRole) {
    const userRole = role?.toLowerCase().trim();
    const targetRole = allowedRole?.toLowerCase().trim();

    if (userRole !== targetRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 3. Render nested protected components
  return <Outlet />;
};

export default ProtectedRoute;