import express from 'express';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
} from '../controllers/auth.controller.js';

const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register new user
 * @access public
 */
authRouter.post('/register', registerUserController);

/**
 * @route POST /api/auth/login
 * @description Login user
 * @access public
 */
authRouter.post('/login', loginUserController);

/**
 * @route POST /api/auth/logout
 * @description Logout user
 * @access public
 */
authRouter.post('/logout', logoutUserController);

export default authRouter;
