import userModel from '../models/user.model.js';
import tokenBlacklistModel from '../models/blacklist.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUserController = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'please provide username, email and password',
    });
  }
  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (isUserAlreadyExist) {
    return res.status(400).json({
      success: false,
      message: 'user with this username or email already exists',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new userModel({
    username,
    email,
    password: hashedPassword,
  });
  await newUser.save();

  const token = jwt.sign(
    { userId: newUser._id, username: newUser.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.cookie('token', token);
  return res.status(201).json({
    success: true,
    message: 'user registered successfully',
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
    token,
  });
};

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'please provide email and password',
    });
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'invalid email or password',
    });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'invalid email or password',
    });
  }
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.cookie('token', token);
  return res.status(200).json({
    success: true,
    message: 'user logged in successfully',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    token,
  });
};

export const logoutUserController = async (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'no token found',
    });
  }
  await tokenBlacklistModel.create({ token });
  res.clearCookie('token');
  return res.status(200).json({
    success: true,
    message: 'user logged out successfully',
  });
};
