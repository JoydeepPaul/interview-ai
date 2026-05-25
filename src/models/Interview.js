import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    topic: {
      type: String,
      required: true,
      enum: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'System Design', 'HTML/CSS', 'General'],
      default: 'JavaScript'
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    questionCount: {
      type: Number,
      default: 10,
      min: 1,
      max: 50
    },
    questions: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question'
        },
        questionText: String,
        difficulty: String,
        order: Number
      }
    ],
    userAnswers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question'
        },
        answer: String,
        timeSpent: Number, // in seconds
        submittedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    scores: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question'
        },
        score: Number, // 0-100
        accuracy: Number, // 0-100
        feedback: String,
        aiEvaluation: mongoose.Schema.Types.Mixed
      }
    ],
    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    overallAccuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    totalDuration: Number, // in seconds
    currentQuestionIndex: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Abandoned'],
      default: 'Active'
    },
    resumeUsed: {
      type: Boolean,
      default: false
    },
    resumeText: String,
    aiAnalysis: {
      strengths: [String],
      weaknesses: [String],
      improvements: [String],
      overallFeedback: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    startedAt: Date,
    completedAt: Date
  },
  { timestamps: true }
);

// Index for efficient queries
InterviewSchema.index({ userId: 1, createdAt: -1 });
InterviewSchema.index({ userId: 1, topic: 1, difficulty: 1 });

export default mongoose.model('Interview', InterviewSchema);
