import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // If no token exists in localStorage, force redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check case-insensitively (e.g. 'Admin' vs 'admin')
  if (allowedRole && role?.toLowerCase() !== allowedRole?.toLowerCase()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If valid, render the nested component layout
  return <Outlet />;
};

export default ProtectedRoute;