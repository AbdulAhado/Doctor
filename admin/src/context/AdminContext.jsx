import { createContext, useState } from "react";
import App from "../App";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

  

const AdminContextProvider = (props) => {
      const [atoken, setAtoken] = useState(localStorage.getItem('atoken')?localStorage.getItem('atoken'):'');
      const [doctors, setDoctors] = useState([]);
      const [appointments, setAppointments] = useState([]);
      const [dashData, setDashData] = useState(false); 
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4500';

    const getAllDoctors = async () => {
      try {
        const {data} = await axios.get(`${backendUrl}/api/admin/all-doctors`,{
          headers: { atoken: atoken }
        })

        if (data.success) {
          setDoctors(data.doctors);
        }else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch doctors");
      }
    }



    const changeAvailability = async (docId) => {
      try {
        const {data} = await axios.get(`${backendUrl}/api/admin/change-availability`,{
          headers: { atoken: atoken },
          params: { docId }
        })

        if (data.success) {
           
          toast.success(data.message);
          getAllDoctors();
        }else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to change availability");
      }
    }  


    const getAllAppointments = async ()=>{
      try {
        const {data} = await axios.get(`${backendUrl}/api/admin/appointments`,{
          headers: { atoken: atoken }
        })

        if (data.success) {
          setAppointments(data.appointment);
        }else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch appointments");
      } 
    } 

    const cancelAppointment = async (appointmentId) => {
      try {
        const {data} = await axios.post(`${backendUrl}/api/admin/cancel-appointment`, {
          appointmentId
        }, {
          headers: { atoken: atoken }
        });

        if (data.success) {
          toast.success(data.message);
          getAllAppointments();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
         toast.error(error.message);
      }
    }

    const getDashData =  async () => {
      try {
        const {data} = await axios.get(`${backendUrl}/api/admin/dashboard`,{headers: { atoken: atoken }});
        if (data.success) {
          setDashData(data.dashData);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }

  const value = {
    atoken,
    setAtoken,
    backendUrl, doctors, getAllDoctors,
    changeAvailability,
    appointments, getAllAppointments, setAppointments,
    cancelAppointment,
    getDashData,
    dashData
  };
  return (
    <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>
  );
};

export default AdminContextProvider;
