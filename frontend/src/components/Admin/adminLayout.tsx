import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { decodeToken, getToken } from '../../services/requests/auth.service';
import { Navbar } from '../navbar';

interface AdminLayoutProps {
    children: React.ReactNode;
    allowedRoles: string[]; // Rôles autorisés
}

interface DecodedToken {
    userPermission?: string;
    userRoles?: { roleName: string }[];
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, allowedRoles }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();

        if (!token) {
            navigate('/');
            return;
        }

        let decoded: DecodedToken;
        try {
            decoded = decodeToken(token);
        } catch {
            navigate('/');
            return;
        }

        const userRoles = [...(decoded.userRoles?.map((r) => r.roleName) || []), decoded.userPermission || ''];

        const hasAccess = userRoles.some((role) => allowedRoles.includes(role));

        if (!hasAccess) {
            navigate('/');
            return;
        }

        setLoading(false);
    }, [navigate, allowedRoles]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto p-6">{children}</main>
        </div>
    );
};
