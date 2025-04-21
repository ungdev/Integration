// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from './pages/Auth';
import { HomePage } from './pages/Home';
import { ProfilPage } from './pages/Profil';
import { ShotgunPage } from './pages/Shotgun';
import { AdminPageRole, AdminPageTeam, AdminPageShotgun, AdminPageExport, AdminPageFaction, AdminPagePerm, AdminPageChall, AdminPageEmail, AdminPageUser } from './pages/Admin';

import ProtectedRoute from './components/utils/protectedroute';
import AdminRoute from './components/utils/adminroute';
import { PermPage } from './pages/Perm';
import { ChallPage } from './pages/Challenge';
import { ParrainnagePage } from './pages/Parrainnage';
import { RegisterPage } from './pages/Register';
import { ResetPasswordPage } from './pages/ResetPassword'
import { WeiPage } from './pages/Wei';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/ResetPassword" element={<ResetPasswordPage />} />

        {/* Utilisateurs connectés */}
        <Route path="/Home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/Profil" element={<ProtectedRoute><ProfilPage /></ProtectedRoute>} />
        <Route path="/Shotgun" element={<ProtectedRoute><ShotgunPage /></ProtectedRoute>} />
        <Route path="/Permanences" element={<ProtectedRoute><PermPage /></ProtectedRoute>} />
        <Route path="/Challenges" element={<ProtectedRoute><ChallPage /></ProtectedRoute>} />
        <Route path="/Parrainnage" element={<ProtectedRoute><ParrainnagePage /></ProtectedRoute>} />
        <Route path="/WEI" element={<ProtectedRoute><WeiPage /></ProtectedRoute>} />

        {/* Admin uniquement */}
        <Route path="/admin/roles" element={<AdminRoute><AdminPageRole /></AdminRoute>} />
        <Route path="/admin/teams" element={<AdminRoute><AdminPageTeam /></AdminRoute>} />
        <Route path="/admin/factions" element={<AdminRoute><AdminPageFaction /></AdminRoute>} />
        <Route path="/admin/shotgun" element={<AdminRoute><AdminPageShotgun /></AdminRoute>} />
        <Route path="/admin/export-import" element={<AdminRoute><AdminPageExport /></AdminRoute>} />
        <Route path="/admin/permanences" element={<AdminRoute><AdminPagePerm /></AdminRoute>} />
        <Route path="/admin/challenge" element={<AdminRoute><AdminPageChall /></AdminRoute>} />
        <Route path="/admin/email" element={<AdminRoute><AdminPageEmail /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminPageUser /></AdminRoute>} />
      </Routes>
    </Router>
    
  );
};

export default App;
