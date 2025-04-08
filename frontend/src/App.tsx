// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from './pages/Auth';
import { HomePage } from './pages/Home';
import { ProfilPage } from './pages/Profil';
import { ShotgunPage } from './pages/Shotgun';
import { AdminPageUser, AdminPageTeam, AdminPageShotgun, AdminPageExport, AdminPageFaction, AdminPagePerm } from './pages/Admin';

import ProtectedRoute from './components/utils/protectedroute';
import AdminRoute from './components/utils/adminroute';
import { PermPage } from './pages/Perm';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LoginPage />} />

        {/* Utilisateurs connectés */}
        <Route path="/Home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/Profil" element={<ProtectedRoute><ProfilPage /></ProtectedRoute>} />
        <Route path="/Shotgun" element={<ProtectedRoute><ShotgunPage /></ProtectedRoute>} />
        <Route path="/Permanences" element={<ProtectedRoute><PermPage /></ProtectedRoute>} />

        {/* Admin uniquement */}
        <Route path="/admin/users" element={<AdminRoute><AdminPageUser /></AdminRoute>} />
        <Route path="/admin/teams" element={<AdminRoute><AdminPageTeam /></AdminRoute>} />
        <Route path="/admin/factions" element={<AdminRoute><AdminPageFaction /></AdminRoute>} />
        <Route path="/admin/shotgun" element={<AdminRoute><AdminPageShotgun /></AdminRoute>} />
        <Route path="/admin/export" element={<AdminRoute><AdminPageExport /></AdminRoute>} />
        <Route path="/admin/permanences" element={<AdminRoute><AdminPagePerm /></AdminRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
