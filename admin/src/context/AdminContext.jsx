import { createContext, useState } from "react";
import App from "../App";

export const AdminContext = createContext();

  

const AdminContextProvider = (props) => {
      const [atoken, setAtoken] = useState(localStorage.getItem('atoken')?localStorage.getItem('atoken'):'');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4500';
  const value = {
    atoken,
    setAtoken,
    backendUrl
  };
  return (
    <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>
  );
};

export default AdminContextProvider;
