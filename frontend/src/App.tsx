import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AdminRoute from './components/utils/adminroute';
import PrivateRoute from './components/utils/privateroute';
import ProtectedRoute from './components/utils/protectedroute';
import {
    AdminPageBus,
    AdminPageChall,
    AdminPageEmail,
    AdminPageEvents,
    AdminPageExport,
    AdminPageFaction,
    AdminPageGames,
    AdminPageNews,
    AdminPagePerm,
    AdminPageRole,
    AdminPageShotgun,
    AdminPageTeam,
    AdminPageTent,
    AdminPageUser
} from './pages/admin';
import LoginPage from './pages/auth';
import ChallPage from './pages/challenge';
import DiscordPage from './pages/discord';
import FoodPage from './pages/food';
import GamesPage from './pages/games';
import HomePage from './pages/home';
import LegalsPage from './pages/legals';
import NewsPage from './pages/news';
import NotFoundPage from './pages/notFound';
import ParrainagePage from './pages/parrainage';
import { AvailablePermanencesPage, MyPermanencesPage, RespoCallPage } from './pages/perm';
import PlanningsPage from './pages/plannings';
import PrivacyPage from './pages/privacy';
import ProfilPage from './pages/profil';
import RegisterPage from './pages/register';
import ResetPasswordPage from './pages/resetPassword';
import Roadbook from './pages/roadbook';
import SdiPage from './pages/sdi';
import ShotgunPage from './pages/shotgun';
import WeiPage from './pages/wei';

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
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/resetpassword" element={<ResetPasswordPage />} />
                <Route path="/roadbook" element={<Roadbook />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/legals" element={<LegalsPage />} />

                {/* Utilisateurs connectés */}
                <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/plannings" element={<ProtectedRoute><PlanningsPage /></ProtectedRoute>} />
                <Route path="/profil" element={<ProtectedRoute><ProfilPage /></ProtectedRoute>} />
                <Route path="/challenges" element={<ProtectedRoute><ChallPage /></ProtectedRoute>} />
                <Route path="/parrainage" element={<ProtectedRoute><ParrainagePage /></ProtectedRoute>} />
                <Route path="/sdi" element={<ProtectedRoute><SdiPage /></ProtectedRoute>} />
                <Route path="/wei" element={<ProtectedRoute><WeiPage /></ProtectedRoute>} />
                <Route path="/food" element={<ProtectedRoute><FoodPage /></ProtectedRoute>} />
                <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
                <Route path="/discord" element={<ProtectedRoute><DiscordPage /></ProtectedRoute>} />

                {/* Étudiant et Admin */}
                <Route path="/shotgun" element={<PrivateRoute permissionRequired="Student"><ShotgunPage /></PrivateRoute>} />
                <Route path="/permanenceslist" element={<PrivateRoute permissionRequired="Student"><AvailablePermanencesPage /></PrivateRoute>} />
                <Route path="/mypermanences" element={<PrivateRoute permissionRequired="Student"><MyPermanencesPage /></PrivateRoute>} />
                <Route path="/permanencesappeal" element={<PrivateRoute permissionRequired="Student"><RespoCallPage /></PrivateRoute>} />
                <Route path="/games" element={<PrivateRoute permissionRequired="Student"><GamesPage /></PrivateRoute>} />

                {/* ResposCE et Admin */}
                <Route path="/admin/teams" element={<PrivateRoute permissionRequired="Admin" roleRequired="Respo CE"><AdminPageTeam /></PrivateRoute>} />
                <Route path="/admin/shotgun" element={<PrivateRoute permissionRequired="Admin" roleRequired="Respo CE"><AdminPageShotgun /></PrivateRoute>} />
                <Route path="/admin/factions" element={<PrivateRoute permissionRequired="Admin" roleRequired="Respo CE"><AdminPageFaction /></PrivateRoute>} />
                <Route path="/admin/permanences" element={<PrivateRoute permissionRequired="Admin" roleRequired="Respo CE"><AdminPagePerm /></PrivateRoute>} />

                {/* ResposCE et Admin */}
                <Route path="/admin/news" element={<PrivateRoute permissionRequired="Admin" roleRequired="Communication"><AdminPageNews /></PrivateRoute>} />

                {/* Arbitre et Admin*/}
                <Route path="/admin/challenge" element={<PrivateRoute permissionRequired="Admin" roleRequired="Arbitre"><AdminPageChall /></PrivateRoute>} />
                {/* Admin uniquement */}
                <Route path="/admin/roles" element={<AdminRoute><AdminPageRole /></AdminRoute>} />
                <Route path="/admin/events" element={<AdminRoute><AdminPageEvents /></AdminRoute>} />
                <Route path="/admin/export-import" element={<AdminRoute><AdminPageExport /></AdminRoute>} />
                <Route path="/admin/email" element={<AdminRoute><AdminPageEmail /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><AdminPageUser /></AdminRoute>} />
                <Route path="/admin/games" element={<AdminRoute><AdminPageGames /></AdminRoute>} />
                <Route path="/admin/tent" element={<AdminRoute><AdminPageTent /></AdminRoute>} />
                <Route path="/admin/bus" element={<AdminRoute><AdminPageBus /></AdminRoute>} />

                {/* Fallback */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

export default App;
