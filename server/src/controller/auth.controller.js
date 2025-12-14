const bcrypt = require("bcrypt");
const User = require("../model/User");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // TEST : Missing fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // TEST : Duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    // TEST : Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // TEST 4: Force USER role (ignore req.body.role)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "USER"
    });

    // TEST : Safe response
    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error"
    });
  }
};


// Login  API
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Test 1 : Missing Fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    //  Test 2 : User Not Found
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // Test 3 : Wrong Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    //  Test 4: Successfull Login
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //  Test 5: Password Not Return
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error"
    });
  }
};
