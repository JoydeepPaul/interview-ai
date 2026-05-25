import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    topic: {
      type: String,
      required: true,
      enum: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'System Design', 'HTML/CSS', 'General'],
      index: true
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
      index: true
    },
    category: {
      type: String,
      enum: ['Fundamentals', 'Advanced', 'Practical', 'Behavioral', 'System Design']
    },
    expectedAnswer: {
      type: String,
      required: true
    },
    answerKeyPoints: [String],
    hints: [String],
    relatedTopics: [String],
    exampleCode: String,
    followUpQuestion: String,
    tags: [String],
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard']
    },
    estimatedTime: {
      type: Number,
      default: 300 // in seconds (5 minutes)
    },
    usageCount: {
      type: Number,
      default: 0
    },
    avgScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    isGenerated: {
      type: Boolean,
      default: false
    },
    generatedBy: String, // 'ai' or 'admin'
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for efficient queries
QuestionSchema.index({ topic: 1, difficulty: 1, isActive: 1 });
QuestionSchema.index({ usageCount: -1 }); // For popular questions

export default mongoose.model('Question', QuestionSchema);
