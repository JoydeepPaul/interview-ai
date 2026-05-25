import Interview from '../models/Interview.js';
import Question from '../models/Question.js';
import * as aiService from '../models/ai.service.js';

// Start new interview
export const startInterview = async (req, res) => {
  try {
    const { topic, difficulty, questionCount = 10, useResume = false } = req.body;
    const userId = req.userId;

    if (!topic || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Topic and difficulty are required'
      });
    }

    // Fetch or generate questions
    let questions = await Question.find({
      topic,
      difficulty,
      isActive: true
    }).limit(questionCount);

    // If not enough questions, generate new ones
    if (questions.length < questionCount) {
      try {
        const generatedQuestions = await aiService.generateQuestions(
          topic,
          difficulty,
          questionCount
        );

        // Save generated questions to database
        const savedQuestions = await Question.insertMany(
          generatedQuestions.map(q => ({
            title: q.title,
            description: q.description,
            topic,
            difficulty,
            expectedAnswer: q.answerKeyPoints?.join('. ') || '',
            answerKeyPoints: q.answerKeyPoints || [],
            hints: [q.hint] || [],
            estimatedTime: (q.estimatedTime || 5) * 60,
            isGenerated: true,
            isActive: true
          }))
        );

        questions = savedQuestions;
      } catch (aiError) {
        console.error('AI generation failed, using available questions:', aiError);
        // Continue with available questions
      }
    }

    // Create interview document
    const interview = new Interview({
      userId,
      topic,
      difficulty,
      questionCount: questions.length,
      questions: questions.map((q, idx) => ({
        questionId: q._id,
        questionText: q.title,
        difficulty: q.difficulty,
        order: idx
      })),
      startedAt: new Date(),
      status: 'Active',
      resumeUsed: useResume
    });

    await interview.save();

    // Update question usage count
    await Question.updateMany(
      { _id: { $in: questions.map(q => q._id) } },
      { $inc: { usageCount: 1 } }
    );

    res.status(201).json({
      success: true,
      message: 'Interview started successfully',
      data: {
        interviewId: interview._id,
        topic: interview.topic,
        difficulty: interview.difficulty,
        questionCount: interview.questionCount,
        questions: questions.map(q => ({
          id: q._id,
          title: q.title,
          description: q.description,
          estimatedTime: q.estimatedTime,
          order: questions.indexOf(q) + 1
        }))
      }
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start interview',
      error: error.message
    });
  }
};

// Submit answer
export const submitAnswer = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { questionId, answer, timeSpent } = req.body;
    const userId = req.userId;

    if (!answer || !questionId) {
      return res.status(400).json({
        success: false,
        message: 'Answer and questionId are required'
      });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Find question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Store user answer
    interview.userAnswers.push({
      questionId,
      answer,
      timeSpent
    });

    // Evaluate answer with AI
    try {
      const evaluation = await aiService.evaluateAnswer(
        question.title,
        answer,
        question.expectedAnswer
      );

      interview.scores.push({
        questionId,
        score: evaluation.score || 0,
        accuracy: evaluation.accuracy || 0,
        feedback: evaluation.feedback || 'No feedback available',
        aiEvaluation: evaluation
      });
    } catch (aiError) {
      console.error('AI evaluation failed:', aiError);
      // Store answer without AI evaluation
      interview.scores.push({
        questionId,
        score: 50,
        accuracy: 50,
        feedback: 'Evaluation pending',
        aiEvaluation: {}
      });
    }

    interview.currentQuestionIndex++;
    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Answer submitted successfully',
      data: {
        evaluation: interview.scores[interview.scores.length - 1],
        progress: {
          current: interview.currentQuestionIndex,
          total: interview.questionCount
        }
      }
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit answer',
      error: error.message
    });
  }
};

// End interview
export const endInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.userId;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Calculate scores
    const totalScore = interview.scores.reduce((sum, s) => sum + (s.score || 0), 0);
    const avgScore = interview.scores.length > 0 ? Math.round(totalScore / interview.scores.length) : 0;
    
    const totalAccuracy = interview.scores.reduce((sum, s) => sum + (s.accuracy || 0), 0);
    const avgAccuracy = interview.scores.length > 0 ? Math.round(totalAccuracy / interview.scores.length) : 0;

    const startTime = interview.startedAt || new Date();
    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / 1000);

    interview.status = 'Completed';
    interview.completedAt = endTime;
    interview.overallScore = avgScore;
    interview.overallAccuracy = avgAccuracy;
    interview.totalDuration = duration;

    // Generate AI analysis
    try {
      const analysis = await aiService.generateOverallFeedback(interview.toObject());
      interview.aiAnalysis = analysis;
    } catch (aiError) {
      console.error('AI analysis failed:', aiError);
    }

    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Interview completed',
      data: {
        interviewId: interview._id,
        status: interview.status,
        overallScore: interview.overallScore,
        overallAccuracy: interview.overallAccuracy,
        totalDuration: interview.totalDuration,
        questionsAttempted: interview.userAnswers.length,
        questionsTotal: interview.questionCount,
        aiAnalysis: interview.aiAnalysis,
        scores: interview.scores
      }
    });
  } catch (error) {
    console.error('Error ending interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end interview',
      error: error.message
    });
  }
};

// Get interview details
export const getInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.userId;

    const interview = await Interview.findById(interviewId)
      .populate('questions.questionId', 'title description')
      .populate('userId', 'username email');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    console.error('Error fetching interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview',
      error: error.message
    });
  }
};

// Get user's interview history
export const getInterviewHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { topic, difficulty, limit = 10, skip = 0 } = req.query;

    let filter = { userId };
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const interviews = await Interview.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Interview.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        interviews,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: parseInt(skip) + interviews.length < total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview history',
      error: error.message
    });
  }
};

// Get hint for a question
export const getHint = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Return existing hint if available
    if (question.hints && question.hints.length > 0) {
      return res.status(200).json({
        success: true,
        data: {
          hint: question.hints[0]
        }
      });
    }

    // Generate hint with AI
    try {
      const hint = await aiService.generateHint(question.title, question.description);
      question.hints.push(hint);
      await question.save();

      res.status(200).json({
        success: true,
        data: {
          hint
        }
      });
    } catch (aiError) {
      res.status(200).json({
        success: true,
        data: {
          hint: 'Think about the key concepts related to this topic.'
        }
      });
    }
  } catch (error) {
    console.error('Error getting hint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get hint',
      error: error.message
    });
  }
};

// Skip question
export const skipQuestion = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.userId;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    interview.currentQuestionIndex++;
    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Question skipped',
      data: {
        currentIndex: interview.currentQuestionIndex,
        totalQuestions: interview.questionCount
      }
    });
  } catch (error) {
    console.error('Error skipping question:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to skip question',
      error: error.message
    });
  }
};

export default {
  startInterview,
  submitAnswer,
  endInterview,
  getInterview,
  getInterviewHistory,
  getHint,
  skipQuestion
};
