import jwt from 'jsonwebtoken'
// ----------------------- user authentication ---------------------------
const authUser = (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: "Not authorized login" });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decode.id;

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
    }
}

export default authUser;