export type PermissionBody = {
    roleIds: number[];
};

export type AddRoleBody = {
    userId: number;
    roleIds: number[];
};

export type DeleteRoleBody = {
    userId: number;
    roleId: number;
};

export type UserRoleQuery = {
    userId: string;
};

export type RoleParams = {
    roleName: string;
    roleId: string;
};

export type PointsBody = {
    roleId: number;
    points: number;
};
