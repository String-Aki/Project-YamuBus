import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SetupBus from './pages/SetupBus';
import Dashboard from './pages/Dashboard';
import Trip from './pages/Trip'

const ProtectedRoute = ({ children }) => {
    const busId = localStorage.getItem('MOUNTED_BUS_ID');
    if (!busId) {
        return <Navigate to="/setup" replace />;
    }
    return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/setup" element={<SetupBus />} />

        <Route path="/login" element={
            <ProtectedRoute>
                <Login />
            </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
            <ProtectedRoute>
                  <Dashboard />
            </ProtectedRoute>
        } />

        <Route path="/trip" element={
            <ProtectedRoute>
                 <Trip />
            </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;