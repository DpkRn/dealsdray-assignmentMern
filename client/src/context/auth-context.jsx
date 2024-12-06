import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";



const authContext = createContext(null);
export const useAuth = () => {
  return useContext(authContext);
};

export const AuthProvider = ({ children }) => {
  const [isAdmin, setAdmin] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const Authenticate = () => {
    setAdmin(true);
  };
  const LogOut = () => {
    setAdmin(false);
  };

  const verifyToken = async () => {
    try {
      // const response = await axios.get("http://localhost:8080/api/auth/verify", {withCredentials: true});
      //  const response = await axios.get("https://portfolio-api-pi-ten.vercel.app/api/auth/verify", {withCredentials: true});
      // if (response.status === 200 && response.data.success) {
      //   Authenticate();
      // }
      if(localStorage.getItem("auth"))
        Authenticate();
        else 
        LogOut()
    } catch (error) {
      console.error("Error verifying token", error);
      setAdmin(false);
    } finally {
      setLoading(false); // Authentication check is done
    }
  };

  useEffect(()=>{
    verifyToken();
  },[isAdmin])

  return (
    <authContext.Provider value={{ isAdmin, isLoading, Authenticate,LogOut }}>
      {children}
    </authContext.Provider>
  );
};
