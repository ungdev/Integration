import api from "../api";

export const sendEmail = async (payload: any) => {

    try{
        const response = await api.post('/email/admin/sendemail', {payload});
  
        return response.data;

    }catch(error : any){
        return error.response.data;
    }

    
};

export const emailPreview = async (templateName: any) =>{

    try{
        
        const response = await api.post('email/admin/previewemail', { templateName })
        return response.data.data

    }catch(error : any){
        return error.response.data;
    }
}