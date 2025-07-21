import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const MyAppiontments = () => {
  const { backendUrl, token, getDoctorsData} = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getUserAppointment = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const onlinePay = () => {
    toast.error("Sorry,This feature is not available yet. But Avalaible Soon!");
  }
  const cancelAppointemnt = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointment();
      } else {
        toast.error(data.message);
        console.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    getUserAppointment();
    getDoctorsData();
  }, [token]);

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("-");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  return (
    <div className="mx-20">
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b  border-gray-500">
        My Appointments
      </p>
      <div>
        {appointments.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b border-gray-300"
          >
            <div>
              <img
                className="bg-indigo-50 w-32"
                src={item.docData.image}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 fonr-medium mt-1">Address</p>
              <p className="text-xs">
                {JSON.parse(item.docData.address).line1}
              </p>
              <p className="text-xs">
                {JSON.parse(item.docData.address).line2}
              </p>
              <p className="text-sm mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:{" "}
                </span>
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && item.payment && !item.isCompleted && <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">Paid</button>}
              {!item.cancelled && !item.isCompleted &&  (
                <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5f6fff] hover:text-white  transition-all duration-all" onClick={onlinePay}>
                   Pay Online
                </button>
              )}

              {!item.cancelled && !item.isCompleted &&  (
                <button
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-all"
                  onClick={() => cancelAppointemnt(item._id)}
                >
                  Cancel Appointment
                </button>
              )}
            {item.cancelled && !item.isCompleted &&  (<button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">Appointment Cancelled</button>)}
            {item.isCompleted &&  (<button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">Completed</button>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppiontments;
