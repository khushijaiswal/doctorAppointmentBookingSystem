const mongoose = require("mongoose")
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const { patientProtected, doctorProtected } = require("./middleware/protected.middleware")
require("dotenv").config()



const app = express()
app.use(express.json()) // req.body
app.use(cookieParser()) // req.cookies
// app.use(express.static("dist"))
app.use(cors({
    origin: true,
    credentials: true // cookie
}))

// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true
// }))
app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/admin", require("./routes/admin.routes"))
app.use("/api/patient", patientProtected, require("./routes/patient.routes"))
app.use("/api/doctor", doctorProtected, require("./routes/doctor.routes"))
app.use("/api/public", require("./routes/public.routes"))

app.use("*", (req, res) => {
    res.status(404).json({ message: "resource not found" })
})


mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("db connected")
    app.listen(5000, console.log("server running"))
})