import { createContext } from "react";
import App from "../App";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const value = {};
  return (
    <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
