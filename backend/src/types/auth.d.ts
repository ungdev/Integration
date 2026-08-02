export type AuthRole = {
    roleId: number;
    roleName: string;
};

export type AuthTokenPayload = {
    userId: number;
    userEmail: string;
    userPermission: string;
    userRoles: AuthRole[];
};

export type AuthTokenUser = {
    id: number;
    email: string;
    permission: string;
    roles: AuthRole[];
};
