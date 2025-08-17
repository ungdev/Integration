import React from "react";

export const RoadbookRedirect: React.FC = () => {
    React.useEffect(() => {
        window.location.href = import.meta.env.VITE_ROADBOOK_URL;
    }, []);
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="alert alert-info text-center" role="alert">
                Redirection en cours...
            </div>
        </div>
    );
};