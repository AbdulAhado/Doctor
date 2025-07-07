import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDb from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'

// app config

const app = express()
const PORT = process.env.PORT || 4500
connectDb()
connectCloudinary()

// middleware used in it
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin', adminRouter)

app.get('/',(req,res)=>{
    res.send("hello wolrd ")
})
app.listen(PORT,()=>{
    console.log(`app is listening on port ${PORT}`)
})

