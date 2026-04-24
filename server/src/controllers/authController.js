 
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const userExists = await User.findOne({ email });
    console.log(" in register controller " );
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    } 
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });
    
    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    console.log("in login controller");
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
      res.json({
                user: {
                  _id: user._id,
                  email: user.email,
                  role: user.role,
                },
                token: generateToken(user),
                message: "Login successful"
              });
      ///console.log("res : " , res);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PROFILE
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};