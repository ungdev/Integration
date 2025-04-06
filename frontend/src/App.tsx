// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Auth';
import {AdminPage} from './pages/Admin';
import {HomePage} from './pages/Home';
import {ProfilPage} from './pages/Profil';
import PrivateRoute from './components/utils/privateroute';
import ProtectedRoute from './components/utils/protectedroute';
import { ShotgunPage } from './pages/Shotgun';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/Profil" element={<ProtectedRoute><ProfilPage /></ProtectedRoute>} />
        <Route path="/Shotgun" element={<ProtectedRoute><ShotgunPage /></ProtectedRoute>} />
        {/* Route protégée par rôle */}
        <Route element={<ProtectedRoute><PrivateRoute permissionRequired="Admin" /></ProtectedRoute>}>
          <Route path="/Admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
