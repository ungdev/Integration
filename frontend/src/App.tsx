import React, { lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AdminRoute from './components/utils/adminroute';
import PrivateRoute from './components/utils/privateroute';
import ProtectedRoute from './components/utils/protectedroute';
import { OnboardingProvider } from './contexts/onboarding';
import { PermanencesProvider } from './contexts/permanences';
import { UserProvider } from './contexts/user';

const AdminPageBanned = lazy(() => import('./pages/admin/adminBanned'));
const AdminPageBus = lazy(() => import('./pages/admin/adminBus'));
const AdminPageChallenges = lazy(() => import('./pages/admin/adminChallenges'));
const AdminPageEmail = lazy(() => import('./pages/admin/adminEmail'));
const AdminPageEvents = lazy(() => import('./pages/admin/adminEvents'));
const AdminPageExport = lazy(() => import('./pages/admin/adminExport'));
const AdminPageFaction = lazy(() => import('./pages/admin/adminFaction'));
const AdminPageGames = lazy(() => import('./pages/admin/adminGames'));
const AdminPageNews = lazy(() => import('./pages/admin/adminNews'));
const AdminPagePerm = lazy(() => import('./pages/admin/adminPerm'));
const AdminPageRole = lazy(() => import('./pages/admin/adminRole'));
const AdminPageShotgun = lazy(() => import('./pages/admin/adminShotgun'));
const AdminPageTeam = lazy(() => import('./pages/admin/adminTeam'));
const AdminPageTent = lazy(() => import('./pages/admin/adminTent'));
const AdminPageUser = lazy(() => import('./pages/admin/adminUser'));
const ChallPage = lazy(() => import('./pages/challenge'));
const DiscordPage = lazy(() => import('./pages/discord'));
const FoodPage = lazy(() => import('./pages/food'));
const GamesPage = lazy(() => import('./pages/games'));
const HomePage = lazy(() => import('./pages/home'));
const LegalsPage = lazy(() => import('./pages/legals'));
const LoginPage = lazy(() => import('./pages/auth'));
const NewsPage = lazy(() => import('./pages/news'));
const NotFoundPage = lazy(() => import('./pages/notFound'));
const ParrainagePage = lazy(() => import('./pages/parrainage'));
const PermanencesPageAvailable = lazy(() => import('./pages/perm/permAvailable'));
const PermanencesPageMy = lazy(() => import('./pages/perm/permMy'));
const PermanencesPageRespoCall = lazy(() => import('./pages/perm/permRespoCall'));
const PlanningsPage = lazy(() => import('./pages/plannings'));
const PrivacyPage = lazy(() => import('./pages/privacy'));
const ProfilPage = lazy(() => import('./pages/profil'));
const RegisterPage = lazy(() => import('./pages/register'));
const ResetPasswordPage = lazy(() => import('./pages/resetPassword'));
const RoadbookPage = lazy(() => import('./pages/roadbook'));
const SdiPage = lazy(() => import('./pages/sdi'));
const ShotgunPage = lazy(() => import('./pages/shotgun'));
const WeiPage = lazy(() => import('./pages/wei'));

const App: React.FC = () => {
    const VITE_ANALYTICS_WEBSITE_ID = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://analytics.uttnetgroup.fr/script.js';
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
            <UserProvider>
                <OnboardingProvider>
                    <PermanencesProvider>
                        <Routes>
                            {/* Public */}
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/resetpassword" element={<ResetPasswordPage />} />
                            <Route path="/roadbook" element={<RoadbookPage />} />
                            <Route path="/privacy" element={<PrivacyPage />} />
                            <Route path="/legals" element={<LegalsPage />} />

                            {/* Utilisateurs connectés */}

                            <Route
                                path="/home"
                                element={
                                    <ProtectedRoute>
                                        <HomePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/plannings"
                                element={
                                    <ProtectedRoute>
                                        <PlanningsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profil"
                                element={
                                    <ProtectedRoute>
                                        <ProfilPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/challenges"
                                element={
                                    <ProtectedRoute>
                                        <ChallPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/parrainage"
                                element={
                                    <ProtectedRoute>
                                        <ParrainagePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/sdi"
                                element={
                                    <ProtectedRoute>
                                        <SdiPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/wei"
                                element={
                                    <ProtectedRoute>
                                        <WeiPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/food"
                                element={
                                    <ProtectedRoute>
                                        <FoodPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/news"
                                element={
                                    <ProtectedRoute>
                                        <NewsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/discord"
                                element={
                                    <ProtectedRoute>
                                        <DiscordPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Étudiant et Admin */}
                            <Route
                                path="/shotgun"
                                element={
                                    <PrivateRoute permissionRequired="Student">
                                        <ShotgunPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/permanenceslist"
                                element={
                                    <PrivateRoute permissionRequired="Student">
                                        <PermanencesPageAvailable />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/mypermanences"
                                element={
                                    <PrivateRoute permissionRequired="Student">
                                        <PermanencesPageMy />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/permanencesappeal"
                                element={
                                    <PrivateRoute permissionRequired="Student">
                                        <PermanencesPageRespoCall />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/games"
                                element={
                                    <PrivateRoute permissionRequired="Student">
                                        <GamesPage />
                                    </PrivateRoute>
                                }
                            />

                            {/* ResposCE et Admin */}
                            <Route
                                path="/admin/teams"
                                element={
                                    <PrivateRoute permissionRequired="Admin" roleRequired="Respo CE">
                                        <AdminPageTeam />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/admin/shotgun"
                                element={
                                    <PrivateRoute permissionRequired="Admin" roleRequired="Respo CE">
                                        <AdminPageShotgun />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/admin/factions"
                                element={
                                    <PrivateRoute permissionRequired="Admin" roleRequired="Respo CE">
                                        <AdminPageFaction />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/admin/permanences"
                                element={
                                    <PrivateRoute permissionRequired="Admin" roleRequired="Respo CE">
                                        <AdminPagePerm />
                                    </PrivateRoute>
                                }
                            />

                            {/* ResposCE et Admin */}
                            <Route
                                path="/admin/news"
                                element={
                                    <PrivateRoute permissionRequired="Admin" roleRequired="Communication">
                                        <AdminPageNews />
                                    </PrivateRoute>
                                }
                            />

                            {/* Arbitre et Admin*/}
                            <Route
                                path="/admin/challenge"
                                element={
                                    <PrivateRoute permissionRequired="Admin" roleRequired="Arbitre">
                                        <AdminPageChallenges />
                                    </PrivateRoute>
                                }
                            />
                            {/* Admin uniquement */}
                            <Route
                                path="/admin/roles"
                                element={
                                    <AdminRoute>
                                        <AdminPageRole />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="/admin/events"
                                element={
                                    <AdminRoute>
                                        <AdminPageEvents />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="/admin/export-import"
                                element={
                                    <AdminRoute>
                                        <AdminPageExport />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="/admin/email"
                                element={
                                    <AdminRoute>
                                        <AdminPageEmail />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="/admin/users"
                                element={
                                    <AdminRoute>
                                        <AdminPageUser />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="/admin/games"
                                element={
                                    <AdminRoute>
                                        <AdminPageGames />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="/admin/tent"
                                element={
                                    <AdminRoute>
                                        <AdminPageTent />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="/admin/bus"
                                element={
                                    <AdminRoute>
                                        <AdminPageBus />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="/admin/banned"
                                element={
                                    <AdminRoute>
                                        <AdminPageBanned />
                                    </AdminRoute>
                                }
                            />

                            {/* Fallback */}
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </PermanencesProvider>
                </OnboardingProvider>
            </UserProvider>
        </Router>
    );
};

export default App;
