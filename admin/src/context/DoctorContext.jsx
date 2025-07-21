import { createContext } from "react";
import App from "../App";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backedUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDtoken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '');
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backedUrl}/api/doctor/appointments`, { headers: { dtoken: dToken } })
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        console.error("Failed to fetch appointments:", data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message)
    }
  }


  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backedUrl}/api/doctor/cancel-appointment`, { appointmentId }, { headers: { dtoken: dToken } })
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error(error);
      toast.error(error.message);

    }
  }

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backedUrl}/api/doctor/complete-appointment`, { appointmentId }, { headers: { dtoken: dToken } })
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error(error);
      toast.error(error.message);

    }
  }

  const getDashdata = async () => {
    try {
      const { data } = await axios.get(`${backedUrl}/api/doctor/dashboard`, { headers: { dtoken: dToken } });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(`${backedUrl}/api/doctor/profile`, { headers: { dtoken: dToken } });
      if (data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }


  const value = {
    backedUrl,
    dToken,
    setDtoken,
    getAppointments,
    appointments, setAppointments,
    cancelAppointment, completeAppointment,
    getDashdata, dashData, setDashData, getProfileData, profileData, setProfileData
  };
  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
