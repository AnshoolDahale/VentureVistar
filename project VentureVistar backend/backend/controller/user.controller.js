const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const {sendResponseError} = require('../middleware/middleware')
const {checkPassword, newToken} = require('../utils/utility.function')

const signUpUser = async (req, res) => {
  const {email, name, password, userType} = req.body
  
  // Input validation
  if (!email || !name || !password || !userType) {
    sendResponseError(400, 'All fields (email, name, password, userType) are required', res)
    return
  }
  
  if (password.length < 6) {
    sendResponseError(400, 'Password must be at least 6 characters long', res)
    return
  }
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({email})
    if (existingUser) {
      sendResponseError(400, 'User with this email already exists', res)
      return
    }
    
    // Let the model handle password hashing through pre-save hook
    await User.create({email, name, password, userType})
    res.status(201).send('Successfully account created')
    return
  } catch (err) {
    console.log('Error: ', err)
    if (err.code === 11000) {
      sendResponseError(400, 'User with this email already exists', res)
    } else {
      sendResponseError(500, 'Something went wrong, please try again', res)
    }
    return
  }
}

const signInUser = async (req, res) => {
  const {password, email} = req.body
  
  // Input validation
  if (!email || !password) {
    sendResponseError(400, 'Email and password are required', res)
    return
  }
  
  try {
    const user = await User.findOne({email})
    if (!user) {
      sendResponseError(400, 'You have to Sign up first !', res)
      return // Critical fix: This was missing, causing potential crashes
    }

    const same = await checkPassword(password, user.password)
    if (same) {
      let token = newToken(user)
      res.status(200).send({status: 'ok', token, userType: user.userType})
      return
    }
    sendResponseError(400, 'Invalid password !', res)
  } catch (err) {
    console.log('ERROR', err)
    sendResponseError(500, 'Server error', res)
  }
}

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) {
      sendResponseError(404, 'User not found', res)
      return
    }
    res.status(200).send({user, userType: user.userType})
  } catch (err) {
    console.log('Error:', err)
    sendResponseError(500, 'Error fetching user profile', res)
  }
}

module.exports = {signUpUser, signInUser, getUser}
