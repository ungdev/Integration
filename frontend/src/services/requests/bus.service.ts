import api from "../api";


export const busAttribution = async()=>{

  const response = await api.post('bus/admin/attributionemail');

  return response?.data
}

export const importBusCSV = async(formData : FormData) => {

      const response = await api.post(`/bus/admin/importbus`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },});
      return response.data;

}