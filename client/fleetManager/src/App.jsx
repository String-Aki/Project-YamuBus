import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreateAccount from './components/CreateAccount.jsx';
import Login from './components/SignIn.jsx';
import FleetDashboard from './components/FleetDashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </Router>
  );
}

export default App;