import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext';

const Navbar = () => {
    const {atoken,setAtoken} = useContext(AdminContext);
    const navigate = useNavigate();
    const logout = () => {
        navigate('/')
        atoken && setAtoken('');
        atoken && localStorage.removeItem('atoken');
    }

  return (
    <div className='flex items-center justify-between bg-white p-3 shadow-md px-4 sm:px-10 broder-b '>
      <div className='flex items-center gap-2 text-sm'>
        <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{atoken ? 'Admin' : "Doctor"}</p>
      </div>
      <button onClick={logout} className='bg-[#5f6fff] text-white text:sm px-10 py-2 rounded-full'>Logout</button>
    </div>
  )
}   

export default Navbar
