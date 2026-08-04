import React from 'react';
import { Navigate } from 'react-router-dom';

import { type DecodedToken } from '../../interfaces/token.interfaces';
import { decodeToken, getToken } from '../../services/requests/auth.service';

interface PrivateRouteProps {
    permissionRequired?: string;
    roleRequired?: string;
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ permissionRequired, roleRequired, children }) => {
    const token = getToken();

    if (!token) {
        return <Navigate to="/" />;
    }

    let decoded: DecodedToken;
    try {
        decoded = decodeToken(token);
    } catch {
        return <Navigate to="/" />;
    }

    const isAdmin = decoded.userPermission === 'Admin';

    const hasPermission = !permissionRequired || decoded.userPermission === permissionRequired;

    const hasRole = !roleRequired || decoded.userRoles?.some((role) => role.roleName === roleRequired);

    if (!isAdmin && !(hasPermission || hasRole)) {
        return <Navigate to="/" />;
    }

    // PrivateRoute only handles authz checks; user data is provided by `UserProvider` at app root.
    return <>{children}</>;
};

export default PrivateRoute;

// UserProvider and useUser moved to src/context/user.tsx
