import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const DoctorAppointment = () => {
  const { dToken, getAppointments, appointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);
  const { currency, calcAge, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll min-h-[50vh]">
        {/* Header for larger screens */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Appointments List */}
        {appointments.reverse().map((item, index) => (
          <div
            key={index}
            className="grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] grid-cols-1 gap-2 py-3 px-6 border-b hover:bg-gray-50"
          >
            {/* Index */}
            <p className="text-sm sm:text-base">{index + 1}</p>

            {/* Patient Info */}
            <div className="grid grid-cols-[auto_1fr] items-center gap-2">
              <img
                className="w-8 h-8 rounded-full"
                src={item.userData.image}
                alt="Patient"
              />
              <p className="text-sm sm:text-base">{item.userData.name}</p>
            </div>

            {/* Payment Method */}
            <p className="text-sm sm:text-base ">{item.payment ? 'Online' : 'Cash'}</p>

            {/* Age */}
            <p className="text-sm sm:text-base">{calcAge(item.userData.dob)}</p>

            {/* Date & Time */}
            <p className="text-sm sm:text-base">
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>

            {/* Fees */}
            <p className="text-sm sm:text-base">{currency}{item.amount}</p>

            {/* Actions */}

            {item.cancelled
              ? <p>Cancelled</p>
              : item.isCompleted
                ? <p className="text-green-500">Completed</p>
                : <div className="grid grid-cols-2 gap-2">
                  <img
                    src={assets.cancel_icon}
                    alt="Cancel"
                    className="w-10 h-10 cursor-pointer"
                    onClick={() => cancelAppointment(item._id)}
                  />
                  <img
                    src={assets.tick_icon}
                    alt="Confirm"
                    className="w-10 h-10 cursor-pointer"
                    onClick={() => completeAppointment(item._id)}
                  />
                </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointment;
