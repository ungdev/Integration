export interface DecodedToken {
    userId: number;
    userEmail : String;
    userPermission?: string;
    userRoles?: { roleName: string }[];
  }