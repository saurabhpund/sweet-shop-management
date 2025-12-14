const bcrypt = require("bcrypt");
const User = require("../model/User");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // TEST 3: Missing fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // TEST 2: Duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    // TEST 5: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // TEST 4: Force USER role (ignore req.body.role)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "USER"
    });

    // TEST 1 + TEST 6: Safe response
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

exports.login = (req, res) => {
  res.status(200).json({ message: "Login route working" });
};
