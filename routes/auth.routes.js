const { registerAdmin, loginAdmin, logoutAdmin, verifyAdminOTP, registerPatient, loginPatient, logoutPatient, registerDoctor, loginDoctor, logoutDoctor } = require("../controller/auth.controller")

const router = require("express").Router()
router
    // .post("/register-admin", registerAdmin)
    .post("/login-admin", loginAdmin)
    .post("/logout-admin", logoutAdmin)
    .post("/verify-admin", verifyAdminOTP)

    // patient routes
    .post("/register-patient", registerPatient)
    .post("/login-patient", loginPatient)
    .post("/logout-patient", logoutPatient)

    // doctor routes
    .post("/register-doctor", registerDoctor)
    .post("/login-doctor", loginDoctor)
    .post("/logout-doctor", logoutDoctor)
module.exports = router