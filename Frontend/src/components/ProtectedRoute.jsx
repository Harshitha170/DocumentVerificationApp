import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // 1. If there is no token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. If a specific role is required and doesn't match, block access
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. If checks pass, render the requested child route
  return <Outlet />;
};

export default ProtectedRoute;