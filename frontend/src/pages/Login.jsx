import React,{useState} from 'react'
import { Form } from 'react-router-dom'

const Login = () => {
  const [sate, setSate] = useState('Sign Up')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setname] = useState('')

  const onsubmit = async (e) =>{ 
    e.preventDefault();

  }
  return (
    <form className='min-h-[80vh] flex items-center mx-20' >
      <div className='flexd flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96  rounded-xl text-zinc-600 text-sm shadow-xl'>
        <p className='text-2xl font-semibold'>{sate === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p className='py-2'>
          Please {sate === 'Sign Up' ? 'Sign up' : 'Login'} to book appointment
        </p>
        {
          sate === 'Sign Up' &&  <div className='w-full'>
          <p className='mt-1'>Full Name</p>
          <input className='border border-zinc-300 outline-0 rounded w-full p-2 mt-1' type="text" onChange={(e)=> setname(e.target.value)} value={name} required/>
        </div>
        }
        
        <div className='w-full'>
          <p className='mt-1'>Email</p>
          <input className='border border-zinc-300 outline-0 rounded w-full p-2 mt-1' type="text" onChange={(e)=> setEmail(e.target.value)} value={email} required/>
        </div>
        <div className='w-full'>
          <p className='mt-1'>Password</p>
          <input className='border border-zinc-300 outline-0 rounded w-full p-2 mt-1' type="text" onChange={(e)=> setPassword(e.target.value)} value={password} required/>
        </div>
        <button className='primary text-white w-full py-2 rounded-md text-base mt-2'>{sate === 'Sign Up' ? 'Create Account' : 'Login'} </button>
        {
          sate === 'Sign Up' 
          ? <p className='mt-2'>Already have an account? <span className='cursor-pointer underline text-primary' onClick={()=> setSate('Login')}>Login here</span></p>
          : <p className='mt-2'>Create a new account ? <span className='cursor-pointer underline text-primary '  onClick={()=> setSate('Sign Up')}>Click here</span></p>
        }
      </div>

    </form>
  )
}

export default Login
