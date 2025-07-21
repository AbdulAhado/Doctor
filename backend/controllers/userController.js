import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { json } from "express";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import AppointmentMOdel from "../models/AppointmentModel.js";

// ---------------- API TO Register User ----------------

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email." });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Enter a storng password of 8 Characters.",
      });
    }
    // ------------------- HAshing of password ------------------
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Adding the user data on database
    const userData = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    // token to sign up user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// ------------------ API for login User --------------------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Does Not Exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// -------------------------- API to get user data ------------------

const getUserData = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// --------------- APi to update user profile ---------------------
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }
    const parsedAddress = JSON.parse(address);
    const updateData = {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    };

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    await userModel.findByIdAndUpdate(userId, updateData, { new: true });

    res.json({ success: true, message: "Profile Updated Successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- APi To Book Appointment -------------------

const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId; // Extracted from authUser middleware
    const { docId, slotDate, slotTime } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID is missing" });
    }

    // Fetch doctor data
    const docData = await doctorModel.findById(docId).select("-password");

    // Validate doctor data
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    // Check if the doctor is available
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor is not available" });
    }

    let slots_booked = docData.slots_booked || {};

    // Check slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot already booked" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    // Fetch user data
    const userData = await userModel.findById(req.userId).select("-password");

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    delete docData.slots_booked;

    const AppointmentData = {
      userId: req.userId, // Use req.userId extracted by authUser middleware
      docId,
      slotDate,
      slotTime,
      userData,
      docData,
      amount: docData.fees,
      date: Date.now(),
    };

    const newAppointment = new AppointmentMOdel(AppointmentData);
    await newAppointment.save();

    // Update doctor slots
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------------------- API To get yser appointments -------------------
const listAppointments = async (req, res) => {
  try {
    // const { userId } = req.body;
    const userId = req.userId; 
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

     const appointments = await AppointmentMOdel.find({ userId });

    if (!appointments || appointments.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No appointments found" });
    }

    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ------------------------  API TO CANCEl THE APPOINTMENT -------------------
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId; // Extracted from authUser middleware
    const { appointmentId } = req.body;

    const appointmentData = await AppointmentMOdel.findById(appointmentId);
    // verify appointment user
    if (appointmentData.userId.toString() !== userId) {
      return res.json({
        success: false,
        message: "You are not authorized to cancel this appointment",
      });
    }

    await AppointmentMOdel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (slot) => slot !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {}
};

export {
  registerUser,
  loginUser,
  getUserData,
  updateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
};
