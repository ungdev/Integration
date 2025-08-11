// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from './pages/Auth';
import { HomePage } from './pages/Home';
import { ProfilPage } from './pages/Profil';
import { ShotgunPage } from './pages/Shotgun';
import { AdminPageRole, 
          AdminPageTeam, 
          AdminPageEvents, 
          AdminPageExport, 
          AdminPageFaction, 
          AdminPagePerm, 
          AdminPageChall, 
          AdminPageEmail, 
          AdminPageUser, 
          AdminPageNews, 
          AdminPageGames} from './pages/Admin';

import ProtectedRoute from './components/utils/protectedroute';
import AdminRoute from './components/utils/adminroute';
import { PermPage } from './pages/Perm';
import { ChallPage } from './pages/Challenge';
import { ParrainagePage } from './pages/Parrainage';
import { RegisterPage } from './pages/Register';
import { ResetPasswordPage } from './pages/ResetPassword'
import { WeiPage } from './pages/Wei';
import { SdiPage } from './pages/Sdi';
import { NewsPage } from './pages/News';
import {DiscordPage} from './pages/Discord';
import PrivateRoute from './components/utils/privateroute';
import { GamesPage } from './pages/Games';
import { FoodPage } from './pages/Food';


const App: React.FC = () => {
  const VITE_ANALYTICS_WEBSITE_ID = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://analytics.uttnetgroup.fr/script.js";
    script.defer = true;
    if (VITE_ANALYTICS_WEBSITE_ID) {
      script.setAttribute('data-website-id', VITE_ANALYTICS_WEBSITE_ID);
    }
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [VITE_ANALYTICS_WEBSITE_ID]);

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
        <Route path="/Challenges" element={<ProtectedRoute><ChallPage /></ProtectedRoute>} />
        <Route path="/Parrainage" element={<ProtectedRoute><ParrainagePage /></ProtectedRoute>} />
        <Route path="/SDI" element={<ProtectedRoute><SdiPage /></ProtectedRoute>} />
        <Route path="/WEI" element={<ProtectedRoute><WeiPage /></ProtectedRoute>} />
        <Route path="/Food" element={<ProtectedRoute><FoodPage /></ProtectedRoute>} />
        <Route path="/News" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
        <Route path="/Discord" element={<ProtectedRoute><DiscordPage /></ProtectedRoute>} />

        {/* Étudiant et Admin */}
        <Route path="/Shotgun" element={<PrivateRoute permissionRequired="Student"><ShotgunPage /></PrivateRoute>} />
        <Route path="/Permanences" element={<PrivateRoute permissionRequired="Student"><PermPage /></PrivateRoute>} />
        <Route path="/Games" element={<PrivateRoute permissionRequired="Student"><GamesPage /></PrivateRoute>} />

        {/* ResposCE et Admin */}
        <Route path="/admin/teams" element={<PrivateRoute permissionRequired="Admin" roleRequired="Respo CE"><AdminPageTeam /></PrivateRoute>} />
        <Route path="/admin/factions" element={<PrivateRoute permissionRequired="Admin" roleRequired="Respo CE"><AdminPageFaction /></PrivateRoute>} />

        {/* ResposCE et Admin */}
        <Route path="/admin/news" element={<PrivateRoute permissionRequired="Admin" roleRequired="Communication"><AdminPageNews /></PrivateRoute>} />

        {/* Arbitre et Admin*/}
        <Route path="/admin/challenge" element={<PrivateRoute permissionRequired="Admin" roleRequired="Arbitre"><AdminPageChall /></PrivateRoute>} />
        {/* Admin uniquement */}
        <Route path="/admin/roles" element={<AdminRoute><AdminPageRole /></AdminRoute>} />
        <Route path="/admin/events" element={<AdminRoute><AdminPageEvents /></AdminRoute>} />
        <Route path="/admin/export-import" element={<AdminRoute><AdminPageExport /></AdminRoute>} />
        <Route path="/admin/permanences" element={<AdminRoute><AdminPagePerm /></AdminRoute>} />
        <Route path="/admin/email" element={<AdminRoute><AdminPageEmail /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminPageUser /></AdminRoute>} />
        <Route path="/admin/games" element={<AdminRoute><AdminPageGames /></AdminRoute>} />
      </Routes>
    </Router>

  );
};

export default App;
