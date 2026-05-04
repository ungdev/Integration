export interface DecodedToken {
    userId: number;
    userEmail: string;
    userPermission?: string;
    userRoles?: { roleName: string }[];
}
