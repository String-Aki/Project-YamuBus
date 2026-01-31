import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import SetupBus from './pages/SetupBus';
import Dashboard from './pages/Dashboard';
import Trip from './pages/Trip'

const RequireSetup = ({ children }) => {
    const busId = localStorage.getItem('MOUNTED_BUS_ID');
    
    if (!busId) {
        return <Navigate to="/setup" replace />;
    }
    
    return children;
};

const PreventReSetup = ({ children }) => {
    const busId = localStorage.getItem('MOUNTED_BUS_ID');
    
    if (busId) {
        return <Navigate to="/trip" replace />; 
    }
    
    return children;
};

const App = () => {
  
  return (
    <BrowserRouter>
    <Toaster position="top-center" />
      <Routes>
        <Route path="/setup" element={
            <PreventReSetup>
                <SetupBus />
            </PreventReSetup>
        } />
        <Route path="/login" element={
            <RequireSetup>
                <Login />
            </RequireSetup>
        } />

        <Route path="/dashboard" element={
            <RequireSetup>
                  <Dashboard />
            </RequireSetup>
        } />

        <Route path="/trip" element={
            <RequireSetup>
                 <Trip />
            </RequireSetup>
        } />

        <Route path="/" element={<Navigate to="/trip" replace />} />

        <Route path="*" element={<Navigate to="/trip" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;