import React from 'react';

import { Footer } from '../components/footer';
import EmergencyModal from '../components/home/emergencyModal';
import { Navbar } from '../components/navbar';
import { RoadBookCard } from '../components/roadbook/roadbookCard';

const RoadbookPage: React.FC = () => (
    <div>
        <Navbar />
        <EmergencyModal />
        <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <RoadBookCard />
            </div>
        </div>
        <Footer />
    </div>
);

export default RoadbookPage;
