const User = require('../models/user.js');
const jwt = require('jsonwebtoken')


function generateToken(id, name) {
  return jwt.sign({ userId: id, name: name }, 'secretkey');
}

async function signup(req, res) {
  const { name, email, phone, password } = req.body;
  try {
    const existingUser = await User.findOne({
      where: { email: email }
    });
    if (existingUser) {
      return res.status(400).send('User already exists. Please login.');
    }
    const newUser = await User.create({ name, email, phone, password });
    return res.status(201).send('Signup successful! Please login.');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Failed to sign up. Please try again.');
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  console.log(req.body)

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("user does not exist");
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // Authentication successful
    // You can generate and send a JWT token to the client for further authentication
    const token = generateToken(user.id,user.name);

    return res.status(200).send({ message: 'Login successful!', token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Failed to log in. Please try again.');
  }
}

module.exports = { signup, login };