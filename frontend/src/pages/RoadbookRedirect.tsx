import React from "react";

export const RoadbookRedirect: React.FC = () => {
    React.useEffect(() => {
        window.location.href = import.meta.env.VITE_ROADBOOK_URL;
    }, []);
    return null;
};