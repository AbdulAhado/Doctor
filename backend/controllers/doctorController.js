import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentMOdel from "../models/AppointmentModel.js";
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.query;
    const docdata = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docdata.available,
    });
    res.json({
      success: true,
      message: "Doctor availability updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorsList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ---------------------------  API for Doctor Login --------------------------
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// -----------------------  Api to get All appointments for docotr panel ----------------------------
const getDoctorAppointments = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentMOdel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// -----------------------  Api to mark appontment completed ----------------------------

const appointCompleted = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentMOdel.findById(appointmentId);
    if (appointmentData && appointmentData.docId.toString() === docId) {
      await appointmentMOdel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({
        success: true,
        message: "Appointment marked as completed",
      });
    } else {
      return res.json({
        success: false,
        message: "Failed to mark appointment as completed",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// -----------------------  Api to mark appontment completed ----------------------------

const appointCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentMOdel.findById(appointmentId);
    if (appointmentData && appointmentData.docId.toString() === docId) {
      await appointmentMOdel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({
        success: true,
        message: "Appointment marked as cancelled",
      });
    } else {
      return res.json({
        success: false,
        message: "Failed to mark appointment as cancelled",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// -----------------------  Api to get dashborad data for doctor panel ----------------------------

const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentMOdel.find({ docId });
    let earnings = 0;
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });
    let patients = [];
    appointments.map((appointment) => {
      if (!patients.includes(appointment.userId)) {
        patients.push(appointment.userId);
      }
    });
    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


// -----------------------  Api to get profile data for doctor panel ----------------------------

  const doctorProfile = async (req, res) => {
    try {
      const {docId} = req.body;
      const profileData = await doctorModel.findById(docId).select("-password");
      
      if (!profileData) {
        return res.json({ success: false, message: "Doctor not found" });
      }
      res.json({ success: true, profileData });
    } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
      
    }
  }


// -----------------------  Api to get profile data for doctor panel ----------------------------

const updateDoctorProfile = async (req,res) => {
    try {
      const {docId , fees, address, available} = req.body; 
      await doctorModel.findByIdAndUpdate(docId, {
        fees,
        address,
        available
      });
      res.json({ success: true, message: "Profile updated successfully" });

    } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
      
    }
}

export {
  changeAvailability,
  doctorsList,
  loginDoctor,
  getDoctorAppointments,
  appointCancel,
  appointCompleted,
  doctorDashboard,
  updateDoctorProfile,
  doctorProfile
};
