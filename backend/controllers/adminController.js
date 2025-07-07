import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'

// --------------------------- API For Adding Dcotor ----------------------------
const addDoctor = async (req,res) => {
    try {
        const {name,email,password,speciality, degree, experience, about, fees, address} = req.body
        // const {name,email,password} = req.body
        const imageFile = req.file

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({success: false, message: 'Please fill all the fields'})
        }
        if(!validator.isEmail(email)){
              return res.status(400).json({success: false, message: 'Please enter a valid email'})
        }

        if(password.length< 8){
            return res.status(400).json({success: false, message: 'Password must be at least 8 characters long'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'})
        const imagerUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
            image: imagerUrl,
            date: Date.now()
        }


        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success: true, message: 'Doctor added successfully'})


    } catch (error) {
        console.log(error)
        res.json({success: false, message: 'Something went wrong', error: error.message})
    }
}

// _______________________ API for Admin Login ____________________________
const loginAdmin = async (req,res) => {
    try {

        const {email, password} = req.body

        if (!email || !password) {
            return res.status(400).json({success: false, message: 'Please fill all the fields'})
        }

        

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            return res.json({success:true,token})
        }

        // Wrong credentials
        return res.status(401).json({ success: false, message: 'Invalid credentials' })
        
    } catch (error) {
        console.log(error)
        res.json({success: false, error: error.message})
    }
}



export {addDoctor,loginAdmin}