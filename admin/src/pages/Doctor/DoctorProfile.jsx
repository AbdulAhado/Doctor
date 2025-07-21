import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData,backedUrl  } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      }

      const {data} = await axios.post(`${backedUrl}/api/doctor/update-profile`, updateData,{headers: {dtoken : dToken}})  
      if(data.success){
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else{
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  // Parse the address field if it's a string
  const parsedProfileData = {
    ...profileData,
    address: typeof profileData?.address === 'string' ? JSON.parse(profileData.address) : profileData.address,
  };

  return parsedProfileData && (
    <div>
      <div className="flex flex-col gap-4 m-5">
        <div>
          <img className="bg-[#5f6fff] w-full sm:max-w-64 rounded-lg" src={parsedProfileData.image} alt="" />
        </div>
        <div className='border flex-1 border-stone-200 rounded-lg px-8 py-7 bg-whtie '>
          {/* Doctor Info */}
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{parsedProfileData.name}</p>
          <div className='flex items-center gap-2 text-gray-600 mt-1'>
            <p>{parsedProfileData.degree} - {parsedProfileData.speciality}</p>
            <button className=''>{parsedProfileData.experience}</button>
          </div>

          {/* About Section */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About</p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{parsedProfileData.about}</p>
          </div>

          {/* Appointment Fee */}
          <p className='text-gray-600 font-medium mt-4'>
            Appointment fee: <span className='text-gray-800'>
              {currency} {isEdit ? (
                <input
                  type="number"
                  onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                  value={parsedProfileData.fees}
                />
              ) : (
                parsedProfileData.fees
              )}
            </span>
          </p>

          {/* Address Section */}
          <div className="flex gap-2 py-2">
            <p> Address: </p>
            <p className='text-sm'>
              {isEdit ? (
                <input
                  type="text"
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  value={parsedProfileData.address?.line1 || ""}
                />
              ) : (
                parsedProfileData.address?.line1 || "No address provided"
              )}
              <br />
              {isEdit ? (
                <input
                  type="text"
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  value={parsedProfileData.address?.line2 || ""}
                />
              ) : (
                parsedProfileData.address?.line2 || "No address provided"
              )}
            </p>
          </div>

          {/* Availability Checkbox */}
          <div className="flex gap-1 pt-2">
            <input
              onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
              checked={parsedProfileData.available}
              type="checkbox"
            />
            <label htmlFor="">Available</label>
          </div>

          {/* Edit/Save Button */}
          {isEdit ? (
            <button
              onClick={updateProfile}
              className='px-4 py-1 border text-[#5f6fff] border-[#5f6fff] text-sm rounded-full mt-5 hover:bg-[#5f6fff] hover:text-white transition-all'
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className='px-4 py-1 border text-[#5f6fff] border-[#5f6fff] text-sm rounded-full mt-5 hover:bg-[#5f6fff] hover:text-white transition-all'
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
