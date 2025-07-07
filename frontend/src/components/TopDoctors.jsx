import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';


const TopDoctors = () => {


    const navigate = useNavigate();
    const {doctors} = useContext(AppContext)


  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 '>
      <h1 className='text-3xl font-medium'>Top Doctors To Book</h1>
      <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
        <div className="w-full grid gap-4 pt-5 gap-y-6 px-3 sm:px-0
  grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
  xl:grid-cols-5
">
      {doctors.slice(0,10).map((item,index)=>(
        <div
        onClick={()=>{navigate(`/appointment/${item._id}`)}}
          className='border  border-blue-200 rounded-xl overflow-hidden hover:shadow-2xs cursor-pointer hover:-translate-y-4 transition-all duration-500 bg-white h-80 flex flex-col'
          key={index}
        >
          <img className='bg-blue-50 w-full h-56 object-cover' src={item.image} alt="" />
          <div className='p-4 flex-1 flex flex-col justify-between'>
            <div className='flex items-center gap-2 text-small text-center text-green-500 '>
              <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
            </div>
            <p className="font-semibold mt-2">{item.name}</p>
            <div className="text-gray-500">{item.speciality}</div> 
          </div>
        </div>
      ))}
      </div>
      <button onClick={()=>{navigate('/doctors'); scrollTo(0,0)}} className='bg-blue-100 text-gray-600 px-12 py-3 rounded-full mt-10 '>More</button>
    </div>
  )
}

export default TopDoctors
