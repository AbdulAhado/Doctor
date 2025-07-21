import doctorModel from "../models/doctorModel.js";

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
    console.error("Error updating doctor availability:", error);
    throw error;
  }
};

const doctorsList = async (req,res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({
      success: true,
      doctors
    });
  } catch (error) {
    console.error("Error updating doctor availability:", error);
    throw error;
  }
};

export { changeAvailability, doctorsList };
