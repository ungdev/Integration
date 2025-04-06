import { useEffect, useState } from "react";
import { isTokenValid } from "src/services/requests/auth.service";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null >(null);
  
    useEffect(() => {
      const verifyToken = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
          const data = await isTokenValid();
          if (data) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      };
      verifyToken();
    }, []);
    return isAuthenticated;
};