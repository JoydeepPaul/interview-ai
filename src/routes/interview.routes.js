import express from 'express';
import * as interviewController from '../controllers/interview.controller.js';
import authMiddleware from '../authMiddleware.js';

const router = express.Router();

// All interview routes require authentication
router.use(authMiddleware);

// Interview management
router.post('/start', interviewController.startInterview);
router.post('/:interviewId/submit', interviewController.submitAnswer);
router.post('/:interviewId/end', interviewController.endInterview);
router.post('/:interviewId/skip', interviewController.skipQuestion);
router.get('/:interviewId', interviewController.getInterview);
router.get('/', interviewController.getInterviewHistory);

// Question hints
router.get('/:interviewId/question/:questionId/hint', interviewController.getHint);

export default router;
