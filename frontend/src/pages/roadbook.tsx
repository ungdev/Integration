import React from "react";
import { RoadBookCard } from "../components/roadbook/roadbookCard";

export const Roadbook: React.FC = () => {
    return (
        <div>
            <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <RoadBookCard />
                </div>
            </div>
            <br /><br />
            <footer className="bg-gray-800 text-white p-4 text-center">
                <p>&copy; 2025 Semaine d'Intégration UTT</p>
            </footer>
        </div>
    );
};