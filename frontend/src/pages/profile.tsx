import { useNavigate } from 'react-router-dom';

import { Footer } from '../components/footer';
import EmergencyModal from '../components/home/emergencyModal';
import { Navbar } from '../components/navbar';
import ProfileCard from '../components/profil/profileCard';
import { UserPreferences } from '../components/profil/roleForm';
import { getPermission } from '../services/requests/user.service';

const ProfilePage = () => {
    const navigate = useNavigate();
    const permission = getPermission();

    if (!permission) {
        navigate('/');
        return null;
    }

    return (
        <div>
            <Navbar />
            <EmergencyModal />
            <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <ProfileCard />
                    {(permission === 'Student' || permission === 'Admin') && <UserPreferences />}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProfilePage;
