 
const express = require("express");
const router = express.Router();

const { register, login , getMe }  = require( "../controllers/authcontroller");
const authorizeRoles = require("../middlewares/roleMiddleware");

const protect = require("../middlewares/authMiddleware");

router.post("/register" ,protect , authorizeRoles("Admin"), register);
router.post("/login", login);
router.get("/me", protect, getMe); 

module.exports = router;