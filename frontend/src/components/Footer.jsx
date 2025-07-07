import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:max-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/* --------------- left section ------------------- */}
        <div>
            <img className='mb-5 w-40' src={assets.logo} alt="" />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur corporis, et, natus velit commodi enim unde autem nisi possimus tempore maxime modi officia, illo veritatis a in repudiandae repellat! Aspernatur.
            </p>
        </div>
        {/* ------------------ center Section----------------- */}
        <div>
            <p className='text-xl font-medium mb-5'>CONPANY</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li >Home </li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
            </ul>
        </div>

        {/* ------------------- Right Sectiojn ---------------- */}
        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+92 329 7374500</li>
            <li>ahadrana0125@gmail.com</li>
            </ul>
        </div>
      </div>
      {/* --------------------- Copyright----------------  */}

      <div>
            <hr />
            <p className='py-5 text-sm text-center '>CopyRight 2025 Prescripto - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
