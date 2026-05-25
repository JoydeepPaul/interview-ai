import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    fileName: String,
    fileUrl: String,
    filePath: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    fileSize: Number,
    mimeType: String,
    parsedContent: {
      fullText: String,
      skills: [String],
      experience: [
        {
          company: String,
          position: String,
          duration: String,
          description: String
        }
      ],
      education: [
        {
          institution: String,
          degree: String,
          field: String,
          graduationYear: String
        }
      ],
      certifications: [String],
      languages: [String],
      projects: [
        {
          name: String,
          description: String,
          technologies: [String]
        }
      ]
    },
    extractedKeywords: [String],
    relatedTopics: [String],
    skillsRating: {
      technical: Number,
      soft: Number,
      overall: Number
    },
    isProcessed: {
      type: Boolean,
      default: false
    },
    processingError: String,
    usedInInterviews: {
      type: Number,
      default: 0
    },
    lastUsedAt: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

ResumeSchema.index({ userId: 1, uploadedAt: -1 });

export default mongoose.model('Resume', ResumeSchema);
