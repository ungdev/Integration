import { useNavigate } from 'react-router-dom';

import { Footer } from '../components/footer';
import EmergencyModal from '../components/home/emergencyModal';
import { Navbar } from '../components/navbar';
import {
    ParrainageNewStudent,
    ParrainageNewStudentEnglish,
    ParrainageStudent,
} from '../components/Parrainnage/parrainageForm';
import { getPermission } from '../services/requests/user.service';

const ParrainagePage = () => {
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
                    {(permission === 'Nouveau' || permission === 'Admin') && <ParrainageNewStudent />}

                    {(permission === 'Nouveau' || permission === 'Admin') && <ParrainageNewStudentEnglish />}

                    {(permission === 'Student' || permission === 'Admin') && <ParrainageStudent />}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ParrainagePage;
