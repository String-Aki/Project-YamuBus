import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FleetManagersDirectory from './pages/FleetManagersDirectory';
import RouteMaster from './pages/RouteMaster';
import Layout from './components/Layout';

const PrivateRoute = () => {
    const token = localStorage.getItem('adminToken');
    return token ? <Outlet /> : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/managers" element={<FleetManagersDirectory />} />
                <Route path="/routes" element={<RouteMaster />} />
            </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;