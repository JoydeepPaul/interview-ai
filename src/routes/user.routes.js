import express from 'express';
import { getMeController } from '../controllers/user.controller.js';
import authMiddleware from '../authMiddleware.js';

const userRouter = express.Router();

/**
 * @route GET /api/user/me
 * @description Get current user profile
 * @access private (requires authentication)
 */
userRouter.get('/me', authMiddleware, getMeController);

export default userRouter;
