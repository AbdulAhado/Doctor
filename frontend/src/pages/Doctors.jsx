import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter,setShowFilter] = useState(false)
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };
  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className="px-20">
      <p className="text-gray-600">Browse thorugh the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5 ">
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter? 'bg-[#5f6fff] text-white ': ""}`} onClick={()=> setShowFilter(prev => !prev)}>Filters</button>
        <div className={` flex-col gap-4 text-sm text-gray-600 ${ showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p
            onClick={() =>
              speciality === "General Physician"
                ? navigate("/doctors")
                : navigate("/doctors/General physician")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer  ${
              speciality === "General Physician"
                ? "bg-indigo-100 text-black "
                : ""
            }`}
          >
            General Physician
          </p>
          <p
            onClick={() =>
              speciality === "Gynecologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gynecologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer  ${
              speciality === "Gynecologist" ? "bg-indigo-100 text-black " : ""
            }`}
          >
            Gynecologist
          </p>
          <p
            onClick={() =>
              speciality === "Dermatologist"
                ? navigate("/doctors")
                : navigate("/doctors/Dermatologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Dermatologist" ? "bg-indigo-100 text-black " : ""
            }`}
          >
            Dermatologist
          </p>
          <p
            onClick={() =>
              speciality === "Pediatricians"
                ? navigate("/doctors")
                : navigate("/doctors/Pediatricians")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer  ${
              speciality === "Pediatricians" ? "bg-indigo-100 text-black " : ""
            }`}
          >
            Pediatricians
          </p>
          <p
            onClick={() =>
              speciality === "Neurologist"
                ? navigate("/doctors")
                : navigate("/doctors/Neurologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer  ${
              speciality === "Neurologist" ? "bg-indigo-100 text-black " : ""
            }`}
          >
            Neurologist
          </p>
          <p
            onClick={() =>
              speciality === "Gastroenterologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gastroenterologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer  ${
              speciality === "Gastroenterologist"
                ? "bg-indigo-100 text-black "
                : ""
            }`}
          >
            Gastroenterologist
          </p>
        </div>
        <div
          className="w-full grid gap-4 pt-5 gap-y-6 px-3 sm:px-0
  grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
  xl:grid-cols-5
"
        >
          {filterDoc.map((item, index) => (
            <div
              onClick={() => {
                navigate(`/appointment/${item._id}`);
              }}
              className="border  border-blue-200 rounded-xl overflow-hidden hover:shadow-2xs cursor-pointer hover:-translate-y-4 transition-all duration-500 bg-white h-80 flex flex-col"
              key={index}
            >
              <img
                className="bg-blue-50 w-full h-56 object-cover"
                src={item.image}
                alt=""
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className={`flex items-center gap-2 text-small text-center ${item.available ? "text-green-500" : "text-gray-500"}`}>
                <p className={`w-2 h-2 ${item.available ? "bg-green-500 " : "bg-gray-500"} rounded-full`}></p><p>{item.available ? "Available" : "Not Available"}</p>
              </div>
                <p className="font-semibold mt-2">{item.name}</p>
                <div className="text-gray-500">{item.speciality}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
