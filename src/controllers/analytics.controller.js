import Interview from '../models/Interview.js';

// Get analytics summary
export const getAnalyticsSummary = async (req, res) => {
  try {
    const userId = req.userId;

    const interviews = await Interview.find({ userId, status: 'Completed' });

    if (interviews.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalInterviews: 0,
          avgScore: 0,
          avgAccuracy: 0,
          totalDuration: 0,
          topicsCovered: 0,
          bestTopic: null,
          worstTopic: null
        }
      });
    }

    const totalScore = interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0);
    const totalAccuracy = interviews.reduce((sum, i) => sum + (i.overallAccuracy || 0), 0);
    const totalDuration = interviews.reduce((sum, i) => sum + (i.totalDuration || 0), 0);

    const avgScore = Math.round(totalScore / interviews.length);
    const avgAccuracy = Math.round(totalAccuracy / interviews.length);

    // Get topics covered
    const topics = interviews.map(i => i.topic);
    const uniqueTopics = [...new Set(topics)];

    // Get best and worst topics
    const topicStats = {};
    interviews.forEach(interview => {
      if (!topicStats[interview.topic]) {
        topicStats[interview.topic] = { scores: [], count: 0 };
      }
      topicStats[interview.topic].scores.push(interview.overallScore);
      topicStats[interview.topic].count++;
    });

    let bestTopic = null;
    let worstTopic = null;
    let bestAvg = 0;
    let worstAvg = 100;

    Object.entries(topicStats).forEach(([topic, data]) => {
      const avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestTopic = { topic, score: Math.round(avg), attempts: data.count };
      }
      if (avg < worstAvg) {
        worstAvg = avg;
        worstTopic = { topic, score: Math.round(avg), attempts: data.count };
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalInterviews: interviews.length,
        avgScore,
        avgAccuracy,
        totalDuration: Math.floor(totalDuration / 60), // Convert to minutes
        topicsCovered: uniqueTopics.length,
        bestTopic,
        worstTopic,
        trends: {
          recentScore: interviews[0]?.overallScore || 0,
          improvementRate: calculateImprovement(interviews)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics summary',
      error: error.message
    });
  }
};

// Get performance by topic
export const getPerformanceByTopic = async (req, res) => {
  try {
    const userId = req.userId;

    const interviews = await Interview.find({ userId, status: 'Completed' });

    const topicStats = {};

    interviews.forEach(interview => {
      if (!topicStats[interview.topic]) {
        topicStats[interview.topic] = {
          topic: interview.topic,
          scores: [],
          attempts: 0,
          difficulties: {}
        };
      }

      topicStats[interview.topic].scores.push(interview.overallScore);
      topicStats[interview.topic].attempts++;

      if (!topicStats[interview.topic].difficulties[interview.difficulty]) {
        topicStats[interview.topic].difficulties[interview.difficulty] = [];
      }
      topicStats[interview.topic].difficulties[interview.difficulty].push(interview.overallScore);
    });

    const performanceData = Object.values(topicStats).map(stat => {
      const avgScore = Math.round(stat.scores.reduce((a, b) => a + b, 0) / stat.scores.length);
      const accuracyTrend = stat.scores.length > 1 ? stat.scores[stat.scores.length - 1] - stat.scores[0] : 0;

      return {
        topic: stat.topic,
        attempts: stat.attempts,
        avgScore,
        highestScore: Math.max(...stat.scores),
        lowestScore: Math.min(...stat.scores),
        accuracyTrend,
        difficultyBreakdown: Object.entries(stat.difficulties).map(([difficulty, scores]) => ({
          difficulty,
          avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
          attempts: scores.length
        }))
      };
    });

    res.status(200).json({
      success: true,
      data: performanceData.sort((a, b) => b.attempts - a.attempts)
    });
  } catch (error) {
    console.error('Error fetching topic performance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topic performance',
      error: error.message
    });
  }
};

// Get performance trends
export const getPerformanceTrends = async (req, res) => {
  try {
    const userId = req.userId;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const interviews = await Interview.find({
      userId,
      status: 'Completed',
      completedAt: { $gte: startDate }
    }).sort({ completedAt: 1 });

    const trendData = [];
    let runningAvg = 0;
    let count = 0;

    interviews.forEach((interview, index) => {
      count++;
      runningAvg = (runningAvg * (count - 1) + interview.overallScore) / count;

      trendData.push({
        date: interview.completedAt.toISOString().split('T')[0],
        score: interview.overallScore,
        movingAvg: Math.round(runningAvg),
        difficulty: interview.difficulty,
        topic: interview.topic,
        duration: interview.totalDuration
      });
    });

    // Group by date and aggregate
    const aggregatedTrends = {};
    trendData.forEach(data => {
      if (!aggregatedTrends[data.date]) {
        aggregatedTrends[data.date] = { scores: [], difficulties: {}, topics: {} };
      }
      aggregatedTrends[data.date].scores.push(data.score);
      aggregatedTrends[data.date].difficulties[data.difficulty] = (aggregatedTrends[data.date].difficulties[data.difficulty] || 0) + 1;
      aggregatedTrends[data.date].topics[data.topic] = (aggregatedTrends[data.date].topics[data.topic] || 0) + 1;
    });

    const formattedTrends = Object.entries(aggregatedTrends).map(([date, data]) => ({
      date,
      avgScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
      interviewsCount: data.scores.length,
      difficulties: data.difficulties,
      topics: data.topics
    }));

    res.status(200).json({
      success: true,
      data: {
        period: `Last ${days} days`,
        totalInterviews: interviews.length,
        trends: formattedTrends,
        overallImprovement: calculateImprovement(interviews),
        averageScore: interviews.length > 0 
          ? Math.round(interviews.reduce((sum, i) => sum + i.overallScore, 0) / interviews.length)
          : 0
      }
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performance trends',
      error: error.message
    });
  }
};

// Get weak areas
export const getWeakAreas = async (req, res) => {
  try {
    const userId = req.userId;

    const interviews = await Interview.find({ userId, status: 'Completed' });

    const questionStats = {};

    interviews.forEach(interview => {
      interview.scores.forEach(score => {
        const qId = score.questionId.toString();
        if (!questionStats[qId]) {
          questionStats[qId] = {
            scores: [],
            feedbacks: []
          };
        }
        questionStats[qId].scores.push(score.score || 0);
        questionStats[qId].feedbacks.push(score.feedback);
      });
    });

    const weakAreas = Object.entries(questionStats)
      .map(([questionId, data]) => {
        const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
        return {
          questionId,
          attempts: data.scores.length,
          avgScore: Math.round(avgScore),
          pattern: avgScore < 50 ? 'Consistent weakness' : 'Needs improvement'
        };
      })
      .filter(item => item.avgScore < 70)
      .sort((a, b) => a.avgScore - b.avgScore)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: weakAreas
    });
  } catch (error) {
    console.error('Error fetching weak areas:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weak areas',
      error: error.message
    });
  }
};

// Helper function to calculate improvement
const calculateImprovement = (interviews) => {
  if (interviews.length < 2) return 0;

  const firstScore = interviews[0]?.overallScore || 0;
  const lastScore = interviews[interviews.length - 1]?.overallScore || 0;

  return lastScore - firstScore;
};

export default {
  getAnalyticsSummary,
  getPerformanceByTopic,
  getPerformanceTrends,
  getWeakAreas
};
