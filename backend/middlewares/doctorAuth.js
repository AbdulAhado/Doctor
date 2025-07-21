import jwt from "jsonwebtoken";

const authDoctor = (req, res, next) => {
  try {
    // const dtoken  = req.headers;
    const dToken = req.headers["dtoken"];
    if (!dToken) {
      return res.json({ success: false, message: "Unauthorized Login" });
    }
    const token = jwt.verify(dToken, process.env.JWT_SECRET);
    if (!req.body) {
      req.body = {};
    }

    req.body.docId = token.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;
