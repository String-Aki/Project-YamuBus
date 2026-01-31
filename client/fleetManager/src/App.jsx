import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CreateAccount from './pages/CreateAccount.jsx';
import Login from './pages/SignIn.jsx';
import FleetDashboard from './pages/FleetDashboard';
import PrivateRoute from './components/common/PrivateRoute.jsx';

function App() {
  return (
    <Router>
    <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />

        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <FleetDashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;