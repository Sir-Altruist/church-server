const mongoose = require('mongoose');
require('dotenv').config();
const { Authentication } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

mongoose.Promise = global.Promise;

// Registration Implementation
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, confirm } =
      req.body;
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !confirm
    ) {
      return res.status(400).json({ msg: 'Please fill empty fields' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: 'Password cannot be less than six characters' });
    }
    if (password !== confirm) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }

    // Check if user already exists
    const user = await Authentication.findOne({ email });
    if (user) return res.status(401).json({ msg: 'User already exist' });

    const newUser = new authentication({
      firstName,
      lastName,
      username,
      email,
      password,
    });

    // Create salt and hash password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        const user = await newUser.save();
        if (user) {
          jwt.sign(
            { id: user.id },
            process.env.SECRET_KEY,
            { expiresIn: 3600 },
            (err) => {
              if (err) throw err;
              return res.status(201).json({ msg: 'Successfully registered' });
            }
          );
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};

// Login Implementation
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Please fill empty fields' });
    }

    const user = await Authentication.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User does not exist' });
    }

    //validate password
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(404).json({ msg: 'Password Incorrect' });
    }
    jwt.sign(
      { id: user.id },
      process.env.SECRET_KEY,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        return res.status(200).json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
          msg: 'Successfully Logged In',
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// Admin Access
exports.admin = async (req, res) => {
  try {
    const user = await Authentication.findById(req.user.id).select('-password');
    if (user) {
      return res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
  }
};
