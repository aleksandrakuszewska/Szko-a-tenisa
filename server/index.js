require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
//middleware
const connection = require('./db')
const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const tokenVerification = require('./middleware/tokenVerification')


connection()

app.use(express.json())
app.use(cors())
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))
app.get("/api/users/",tokenVerification)
app.get("/api/users/account-details",tokenVerification)
app.delete("/api/users/",tokenVerification)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/users/change-password",tokenVerification);
// app.use("/api/users/calendar", tokenVerification);


