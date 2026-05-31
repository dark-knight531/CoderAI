import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing.jsx';
import Home from '../pages/Home.jsx';
import Dashboard from '../pages/Dashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page 1: The Intro Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Page 2: The Login/Register Page */}
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Catch-all route: If user types a random URL, send them back to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;