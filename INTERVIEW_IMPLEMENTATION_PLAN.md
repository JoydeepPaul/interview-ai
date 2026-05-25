# Interview AI - Implementation Plan

## Overview
Complete the Interview AI project with core interview features, AI integration, and analytics.

---

## PHASE 1: Interview Session System (CORE)

### Step 1.1: Create Interview Model
**File:** `src/models/Interview.js`

```javascript
const interviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true,
    enum: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'System Design', 'Behavioral'],
    default: 'JavaScript'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  userAnswers: [{
    questionId: Schema.Types.ObjectId,
    answer: String,
    submittedAt: Date
  }],
  scores: [{
    questionId: Schema.Types.ObjectId,
    score: Number,
    accuracy: Number,
    feedback: String
  }],
  overallScore: Number,
  overallAccuracy: Number,
  totalDuration: Number,
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Abandoned'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  resumeText: String
});
```

### Step 1.2: Create Question Model
**File:** `src/models/Question.js`

```javascript
const questionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  topic: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard']
  },
  category: String,
  correctAnswer: String,
  hints: [String],
  followUp: String,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

### Step 1.3: Create Interview Controller
**File:** `src/controllers/interview.controller.js`

```javascript
// startInterview(req, res) - POST /api/interviews/start
// {topic, difficulty}
// Returns: { interviewId, questions: [10 questions] }

// submitAnswer(req, res) - POST /api/interviews/:id/submit
// {questionId, answer}
// Returns: { score, feedback, nextQuestion }

// endInterview(req, res) - POST /api/interviews/:id/end
// Returns: { overallScore, feedback, duration }

// getInterview(req, res) - GET /api/interviews/:id
// Returns: { interview details, questions, answers, scores }

// getInterviews(req, res) - GET /api/interviews
// Returns: [list of all interviews for user]
```

### Step 1.4: Create Interview Routes
**File:** `src/routes/interview.routes.js`

```javascript
router.post('/start', authMiddleware, startInterview);
router.get('/:id', authMiddleware, getInterview);
router.post('/:id/submit', authMiddleware, submitAnswer);
router.post('/:id/end', authMiddleware, endInterview);
router.get('/', authMiddleware, getInterviews);
```

### Step 1.5: Create Question Service
**File:** `src/services/question.service.js`

```javascript
// sampleQuestions - Returns 10 random questions by topic/difficulty
// generateQuestions - Uses AI to generate new questions
// evaluateAnswer - Uses AI to score user answer
// getFeedback - Generates feedback based on answer quality
```

---

## PHASE 2: Frontend Interview UI

### Step 2.1: Create Interview Practice Page
**File:** `frontend/src/pages/Interview/InterviewPracticePage.jsx`

```jsx
// Main interview container
// - Displays current question (1/10)
// - Shows timer
// - Handles answer submission
// - Shows progress bar
// - Navigation (Previous/Next)
```

### Step 2.2: Create Question Display Component
**File:** `frontend/src/components/Interview/QuestionCard.jsx`

```jsx
// Props: {question, currentNumber, totalCount, difficulty}
// Displays:
// - Question number (1/10)
// - Question text
// - Difficulty badge
// - Time limit indicator
// - Helpful hints (optional)
```

### Step 2.3: Create Answer Input Component
**File:** `frontend/src/components/Interview/AnswerInput.jsx`

```jsx
// Props: {onSubmit, loading}
// Features:
// - Text area for typing answer
// - Character counter
// - Submit button
// - Skip button
// - Voice input option (future)
```

### Step 2.4: Create Timer Component
**File:** `frontend/src/components/Interview/Timer.jsx`

```jsx
// Props: {duration, onTimeUp}
// Displays countdown timer
// Warns when time is running out (< 1 min)
// Auto-submits when time reaches 0
```

### Step 2.5: Create Progress Component
**File:** `frontend/src/components/Interview/ProgressBar.jsx`

```jsx
// Props: {current, total}
// Visual progress indicator
// Shows question number
// Smooth animation
```

### Step 2.6: Create Results Page
**File:** `frontend/src/pages/Interview/ResultsPage.jsx`

```jsx
// Displays:
// - Overall score (0-100)
// - Accuracy percentage
// - Duration taken
// - Score breakdown per question
// - AI feedback for each answer
// - Action buttons (Retake, View Details, Dashboard)
```

---

## PHASE 3: AI Integration (Google GenAI)

### Step 3.1: Setup Google GenAI
**File:** `src/services/ai.service.js`

```javascript
// Initialize Google GenAI
// - Load API key from environment
// - Create model instance
// - Set up prompt templates

// Functions:
// evaluateAnswer(question, userAnswer, correctAnswer) - Score 0-100
// generateFeedback(question, userAnswer, score) - Detailed feedback
// generateQuestions(topic, difficulty, count) - Generate new questions
// generateHints(question) - Hint for user
```

### Step 3.2: Integrate AI Question Generation
**Endpoint:** `POST /api/questions/generate`

```javascript
// Request: {topic, difficulty, count}
// Response: [array of generated questions]
// Uses: Google GenAI to create relevant questions
```

### Step 3.3: Integrate AI Answer Evaluation
**Update:** `submitAnswer` controller

```javascript
// Call AI to evaluate answer
// Compare with correct answer
// Generate score (0-100)
// Create personalized feedback
// Store in database
```

### Step 3.4: Integrate AI Feedback Generation
**Endpoint:** `GET /api/interviews/:id/feedback`

```javascript
// Analyze all answers
// Generate overall feedback
// Identify weak areas
// Suggest improvements
// Create study tips
```

---

## PHASE 4: Analytics & History

### Step 4.1: Create Analytics Controller
**File:** `src/controllers/analytics.controller.js`

```javascript
// getAnalyticsSummary(req, res) - GET /api/analytics/summary
// Returns: {totalInterviews, avgScore, totalDuration, topicsAttempted}

// getPerformanceByTopic(req, res) - GET /api/analytics/topics
// Returns: [{topic, score, attempts, accuracy, improvement}]

// getPerformanceTrend(req, res) - GET /api/analytics/trends
// Returns: [week/month trend data for charting]

// getWeakAreas(req, res) - GET /api/analytics/weak-areas
// Returns: [topics/questions where user struggles]
```

### Step 4.2: Create Analytics Routes
**File:** `src/routes/analytics.routes.js`

```javascript
router.get('/summary', authMiddleware, getAnalyticsSummary);
router.get('/topics', authMiddleware, getPerformanceByTopic);
router.get('/trends', authMiddleware, getPerformanceTrend);
router.get('/weak-areas', authMiddleware, getWeakAreas);
```

### Step 4.3: Create Dashboard Page
**File:** `frontend/src/pages/Dashboard/DashboardPage.jsx`

```jsx
// Display:
// - Quick stats (Total interviews, Avg score, Time spent)
// - Performance chart (Chart.js or Recharts)
// - Topic breakdown
// - Recent interviews
// - Weak areas to work on
// - Action: Start new interview button
```

### Step 4.4: Create History Page
**File:** `frontend/src/pages/Dashboard/HistoryPage.jsx`

```jsx
// Display:
// - List of all past interviews
// - Filter by topic/difficulty
// - Sort by date/score
// - Click to view details
// - Delete option
```

---

## PHASE 5: Resume Features

### Step 5.1: Create Resume Upload Controller
**File:** `src/controllers/resume.controller.js`

```javascript
// uploadResume(req, res) - POST /api/resume/upload
// - Handle multipart file upload
// - Parse PDF using pdf-parse
// - Extract text
// - Store in User model
// - Return parsed content

// getResume(req, res) - GET /api/resume
// - Return user's resume data

// deleteResume(req, res) - DELETE /api/resume
// - Remove resume from database
```

### Step 5.2: Setup PDF Parser
**File:** `src/services/pdf.service.js`

```javascript
// parsePDF(buffer) - Extract text from PDF
// extractSkills(text) - AI extract skills
// extractExperience(text) - AI extract experience
// extractEducation(text) - AI extract education
```

### Step 5.3: Add Resume Upload Page
**File:** `frontend/src/pages/Profile/ResumeUploadPage.jsx`

```jsx
// Features:
// - Drag & drop area
// - File input
// - Upload progress
// - Display parsed resume
// - Edit fields
// - Save to profile
```

---

## PHASE 6: Polish & Deploy

### Step 6.1: Error Handling
- Add error boundaries
- Handle network errors
- Show error messages
- Retry mechanisms

### Step 6.2: Loading States
- Show skeleton screens
- Loading spinners
- Disable buttons during loading
- Prevent double submissions

### Step 6.3: Responsive Design
- Mobile breakpoints
- Tablet layout
- Desktop layout
- Touch-friendly buttons
- Optimized forms

### Step 6.4: Performance
- Optimize images
- Code splitting
- Lazy loading
- Database indexing
- API caching

### Step 6.5: Testing
- Unit tests
- Integration tests
- E2E tests
- Manual testing checklist

### Step 6.6: Deployment
- Prepare production environment
- Set up environment variables
- Deploy backend (Heroku/Railway/Render)
- Deploy frontend (Vercel/Netlify)
- Set up database backups
- Monitor logs

---

## Timeline Estimate

| Phase | Component | Duration | Status |
|-------|-----------|----------|--------|
| 1 | Interview Models & APIs | 4 hours | ⏳ |
| 2 | Interview UI Pages | 6 hours | ⏳ |
| 3 | AI Integration | 8 hours | ⏳ |
| 4 | Analytics | 6 hours | ⏳ |
| 5 | Resume Features | 4 hours | ⏳ |
| 6 | Polish & Deploy | 6 hours | ⏳ |
| **TOTAL** | **Complete Project** | **34 hours** | **~1 week** |

---

## Database Schema Summary

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (ObjectId)   │
│ username        │
│ email           │
│ password        │
│ resume          │
│ createdAt       │
└─────────────────┘
        │
        ├─────┬──────────┬────────────┐
        │     │          │            │
    Interviews Questions  Analytics  Resume
```

---

## Key Features Summary

### Interview Practice
- ✅ Start interview (select topic & difficulty)
- ✅ Display questions (one at a time)
- ✅ Answer input (text with character limit)
- ✅ Timer (5-10 min per question)
- ✅ Navigation (Previous/Next buttons)
- ✅ Progress tracking (X/10 questions)

### AI Feedback
- ✅ Score answers (0-100)
- ✅ Generate feedback (specific improvements)
- ✅ Provide hints (guide without spoiling)
- ✅ Compare with expected answer
- ✅ Identify weak areas

### Analytics
- ✅ Track performance (score trends)
- ✅ Topic breakdown (where you excel)
- ✅ History (all past interviews)
- ✅ Progress metrics (improvement over time)
- ✅ Weak areas (what to focus on)

### Profile
- ✅ Resume upload & parsing
- ✅ User preferences (favorite topics)
- ✅ Interview settings (difficulty, duration)
- ✅ Account settings

---

## API Summary

### Interview APIs
```
POST   /api/interviews/start        Create new interview
GET    /api/interviews/:id          Get interview details
POST   /api/interviews/:id/submit    Submit answer
POST   /api/interviews/:id/end       End interview
GET    /api/interviews              Get interview history
```

### Analytics APIs
```
GET    /api/analytics/summary       Quick stats
GET    /api/analytics/topics        Performance by topic
GET    /api/analytics/trends        Trend data
GET    /api/analytics/weak-areas    Areas to improve
```

### Resume APIs
```
POST   /api/resume/upload           Upload resume
GET    /api/resume                  Get resume
DELETE /api/resume                  Delete resume
```

### Question APIs
```
GET    /api/questions               Get all questions
POST   /api/questions/generate      Generate with AI
GET    /api/questions/:id           Get specific question
```

---

## Environment Setup

### .env (Backend)
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/interview-ai
JWT_SECRET=your_jwt_secret_key
GOOGLE_AI_KEY=your_google_genai_api_key
PORT=3000
NODE_ENV=development
```

### .env (Frontend)
```
VITE_API_URL=http://localhost:3000/api
```

---

## Success Criteria

✅ Users can start interview practice
✅ AI generates relevant questions
✅ System evaluates answers
✅ Users see score & feedback
✅ Analytics dashboard works
✅ Resume upload works
✅ Mobile responsive
✅ Production ready
✅ Error handling complete
✅ Performance optimized

---

## Dependencies to Add

### Backend
```
npm install pdf-parse multer@2.0.2
```

### Frontend
```
npm install chart.js react-chartjs-2 
# or
npm install recharts
```

---

## Quick Start Commands

```bash
# Backend
cd src
npm run dev

# Frontend
cd frontend
npm run dev

# After setup
# Backend: http://localhost:3000
# Frontend: http://localhost:5173
```

---

## Notes for Unique Design

1. **Color Theme:** Professional blue (#0A66C2) with sky blue accents (#00A1DE)
2. **Layout:** Card-based, modern, minimalist
3. **Animations:** Smooth transitions, subtle effects
4. **Responsive:** Mobile-first approach
5. **Accessibility:** WCAG AA compliant
6. **Typography:** Inter or Poppins font
7. **Icons:** Use emoji or Lucide React icons

---

## Next Immediate Steps

1. ✅ Read this plan
2. Create Interview Model (1 hour)
3. Create Interview Controller & Routes (1 hour)
4. Test with Postman (30 min)
5. Create Interview Practice Page (2 hours)
6. Connect frontend to backend (1 hour)
7. Test full flow (1 hour)
8. Continue with AI integration

**Total for MVP: ~7 hours**

Ready to build! 🚀
