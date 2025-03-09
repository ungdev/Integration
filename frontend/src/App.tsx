// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Navbar} from './components/navbar';
import LoginPage from './pages/Auth';
import RegisterPage from './pages/Auth';
import AdminPage from './pages/Admin';
import Home from './pages/Home';
import PrivateRoute from './components/utils/privateroute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Home" element={<Home />} />
        {/* Route protégée par rôle */}
        <Route element={<PrivateRoute roleRequired="admin" />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
