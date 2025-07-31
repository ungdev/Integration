import api from '../api';

export const getUserPrefrences = async () => {
  try{
    const response = await api.get("/role/user/userpreferences");
    const userPreferences = response.data.data;

    return userPreferences;
  }
  catch(error){
    throw new Error("Error while fecthing preferences" + error);
  }
  
}

export const updateUserPreferences = async (selectedRoles : any) => {
  try{
    const response = await api.put("/role/user/updateuserpreferences", { roleIds: selectedRoles });
    const userPreferences = response.data.data;

    return userPreferences;
  }
  catch(error){
    throw new Error("Error while updating preferences" + error);
  }
  
}

export const getUsersByRoleHandler  = async (roleName: string) => {
  try{
    const response = await api.get("/role/admin/userbyrolehandler/"+roleName);
    const userbyRole = response.data.data;
  
    return userbyRole;
  
  }
  catch(error){
    throw new Error("Error while getting preferences" + error);
  }

}

export const addRolesToUser  = async (selectedUser: number, selectedRoles: number[]) => {
  try{
    const response = await api.post("/role/admin/addroletouser", { userId: selectedUser, roleIds: selectedRoles});

    return response.data
  
  }
  catch(error){
    throw new Error("Error while adding role to user" + error);
  }

}

export const deleteRolesToUser = async (selectedUser: number, selectedRole: number)=>{
  try{
    const response = await api.delete("/role/admin/deleteroletouser", {data: { userId: selectedUser, roleId: selectedRole}});

    return response.data

  }
  catch(error){
    throw new Error("Error while deleting role to user" + error);
  }
}

export const getUsersWithRoles  = async () => {
  try{
    const response = await api.get("/role/admin/userswithroles");
    const usersWithRoles = response.data.data;
  
    return usersWithRoles;
  
  }
  catch(error){
    throw new Error("Error while getting preferences" + error);
  }

}

export const getRoles  = async () => {
  try{
    const response = await api.get("/role/user/getroles");
    const roles = response.data.data;
  
    return roles;
  
  }
  catch(error){
    throw new Error("Error while getting roles" + error);
  }

}

export const getUsersRoles = async (userId : number) => {
  try{
    const response = await api.get('/role/admin/getusersroles', {params: {userId}});
    const userRoles = response.data.data;
  
    return userRoles;
  
  }
  catch(error){
    console.log(error);
    throw new Error("Error while getting roles " + error);
  }

}


