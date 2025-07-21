import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedComponents from "../components/RelatedComponents";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, currencySymbol, backendUrl, getDoctorsData, token } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDocInfo = async () => {
    setLoading(true);
    if (doctors.length === 0) {
      await getDoctorsData(); // Fetch doctors if not already loaded
    }
    const docInfo = doctors.find((doc) => doc._id === docId);
    if (!docInfo) {
      toast.error("Doctor not found");
      return navigate("/doctors");
    }
    setDocInfo(docInfo);
    setLoading(false);
  };

  const getAvailableSlots = () => {
    if (!docInfo || !docInfo.slots_booked) {
      console.warn("docInfo or slots_booked is not available");
      return;
    }

    const slotsBooked = docInfo.slots_booked;
    const today = new Date();
    const slots = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const slotDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
      const timeSlots = [];

      for (let hour = 10; hour < 21; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const formattedTime = new Date(currentDate.setHours(hour, minute)).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
          const isBooked =
            slotsBooked[slotDate]?.includes(formattedTime) || false;

          if (!isBooked) {
            timeSlots.push({
              time: formattedTime,
              datetime: new Date(currentDate.setHours(hour, minute)),
            });
          }
        }
      }

      slots.push(timeSlots);
    }

    setDocSlots(slots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book an appointment");
      return navigate("/login");
    }
    try {
      const date = docSlots[slotIndex][0].datetime;
      const slotDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          docId,
          slotDate,
          slotTime,
        },
        {
          headers: {
            token,
          },
        }
      );

      if (data.success) {
        toast.success("Appointment booked successfully");
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to book appointment");
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  return loading ? (
    <p>Loading...</p>
  ) : (
    docInfo && (
      <div className="px-25">
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full ">
                {docInfo.experience}
              </button>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment Fee:{" "}
              <span className="text-gray-600">
                {docInfo.fees} {currencySymbol}
              </span>
            </p>
            {/* About Section */}
            <p className="text-gray-700 font-medium mt-4">About</p>
            <p className="text-gray-600 text-sm mt-1">{docInfo.about}</p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index
                      ? "primary text-white"
                      : "border border-gray-200"
                    }`}
                  key={index}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime
                      ? "primary text-white"
                      : "text-gray-400 border border-gray-300"
                    }`}
                  key={index}
                >
                  {item.time}
                </p>
              ))}
          </div>
          <button
            onClick={bookAppointment}
            className="primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
          >
            Book An Appointment
          </button>
        </div>
      </div>
    )
  );
};

export default Appointment;
