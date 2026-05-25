import express from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import authMiddleware from '../authMiddleware.js';

const router = express.Router();

// All analytics routes require authentication
router.use(authMiddleware);

router.get('/summary', analyticsController.getAnalyticsSummary);
router.get('/topics', analyticsController.getPerformanceByTopic);
router.get('/trends', analyticsController.getPerformanceTrends);
router.get('/weak-areas', analyticsController.getWeakAreas);

export default router;
