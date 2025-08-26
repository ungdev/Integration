// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from './pages/auth';
import { HomePage } from './pages/home';
import { ProfilPage } from './pages/profil';
import { ShotgunPage } from './pages/shotgun';
import {
  AdminPageRole,
  AdminPageTeam,
  AdminPageEvents,
  AdminPageExport,
  AdminPageFaction,
  AdminPagePerm,
  AdminPageChall,
  AdminPageEmail,
  AdminPageUser,
  AdminPageNews,
  AdminPageGames,
  AdminPageTent
} from './pages/admin';

import ProtectedRoute from './components/utils/protectedroute';
import AdminRoute from './components/utils/adminroute';
import { AvailablePermanencesPage, MyPermanencesPage, RespoCallPage } from './pages/perm';
import { ChallPage } from './pages/challenge';
import { ParrainagePage } from './pages/parrainage';
import { RegisterPage } from './pages/register';
import { ResetPasswordPage } from './pages/resetPassword'
import { WeiPage } from './pages/wei';
import { SdiPage } from './pages/sdi';
import { NewsPage } from './pages/news';
import { DiscordPage } from './pages/discord';
import PrivateRoute from './components/utils/privateroute';
import { GamesPage } from './pages/games';
import { FoodPage } from './pages/food';
import { PlanningsPage } from './pages/plannings';


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
        <Route path="/roadbook" element={<Roadbook />} />

        {/* Utilisateurs connectés */}
        <Route path="/Home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/Plannings" element={<ProtectedRoute><PlanningsPage /></ProtectedRoute>} />
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
        <Route path="/PermanencesList" element={<PrivateRoute permissionRequired="Student"><AvailablePermanencesPage /></PrivateRoute>} />
        <Route path="/MyPermanences" element={<PrivateRoute permissionRequired="Student"><MyPermanencesPage /></PrivateRoute>} />
        <Route path="/PermanencesAppeal" element={<PrivateRoute permissionRequired="Student"><RespoCallPage /></PrivateRoute>} />
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
        <Route path="/admin/tent" element={<AdminRoute><AdminPageTent /></AdminRoute>} />
      </Routes>
    </Router>

  );
};

export default App;
