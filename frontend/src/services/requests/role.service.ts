import api from "../api";

export const fetchUserPreferences = async () => {

    const { data } = await api.get("/role/user/userpreferences");
    return data.data;

};

export const updateUserPreferences = async (roleIds: number[]) => {

    const { data } = await api.put("/role/user/updateuserpreferences", { roleIds });
    return data.data;

};

export const fetchAvailableRoles = async () => {

    const { data } = await api.get("/role/user/getroles");
    return data.data;

};

export const fetchAllRolePoints = async ()=> {

    const { data } = await api.get("/role/user/points");
    return data.data;

};

export const fetchRolePointsById = async (roleId: number)=> {

    const { data } = await api.get(`/role/user/points/${roleId}`);
    return data.data;

};

// 🔹 Admin Routes

export const fetchUsersByRole = async (roleName: string) => {

    const { data } = await api.get(`/role/admin/userbyrolehandler/${roleName}`);
    return data.data;

};

export const assignRolesToUser = async (userId: number, roleIds: number[]) => {

    const { data } = await api.post("/role/admin/addroletouser", { userId, roleIds });
    return data;

};

export const removeRoleFromUser = async (userId: number, roleId: number) => {

    const { data } = await api.delete("/role/admin/deleteroletouser", {
      data: { userId, roleId },
    });
    return data;

};

export const fetchUsersWithRoles = async () => {

    const { data } = await api.get("/role/admin/userswithroles");
    return data.data;

};

export const fetchUserRoles = async (userId: number) => {

    const { data } = await api.get("/role/admin/getusersroles", {
      params: { userId },
    });
    return data.data;

};

export const addPointsToRole = async (roleId: number, points: number) => {

    const { data } = await api.post("/role/admin/points/add", { roleId, points });
    return data;

};

export const removePointsFromRole = async (roleId: number, points: number) => {

    const { data } = await api.post("/role/admin/points/remove", { roleId, points });
    return data;

};
