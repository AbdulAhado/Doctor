import express from 'express';
import {appointCancel, appointCompleted, doctorDashboard, doctorProfile, doctorsList, getDoctorAppointments, loginDoctor, updateDoctorProfile} from '../controllers/doctorController.js';
import authDoctor from '../middlewares/doctorAuth.js';
const doctorRouter = express.Router();
doctorRouter.get('/list',doctorsList )
doctorRouter.post('/login', loginDoctor);  
doctorRouter.get('/appointments', authDoctor, getDoctorAppointments);  
doctorRouter.post('/complete-appointment', authDoctor, appointCompleted);  
doctorRouter.get('/cancel-appointment', authDoctor, appointCancel);  
doctorRouter.get('/dashboard', authDoctor, doctorDashboard);  
doctorRouter.get('/profile', authDoctor, doctorProfile);  
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile);  





export default doctorRouter;