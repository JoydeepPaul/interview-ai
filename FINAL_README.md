# 🎯 Interview AI - Complete Production-Ready Project

A full-stack AI-powered interview preparation platform built with React, Node.js, MongoDB, and Google GenAI.

## ✨ Features

### 🎓 Interview Practice
- **Adaptive Questions**: AI-generated questions based on topic and difficulty
- **Real-time Evaluation**: Instant AI feedback on your answers
- **Progress Tracking**: Detailed analytics and performance trends
- **Interview History**: View all past interviews with detailed breakdown

### 🤖 AI-Powered Features
- **Smart Question Generation**: AI creates relevant interview questions
- **Answer Evaluation**: AI evaluates your answers and provides feedback
- **Performance Analysis**: Identify strengths and weaknesses
- **Personalized Recommendations**: Get study suggestions based on performance

### 📊 Analytics Dashboard
- **Performance Metrics**: Track score trends over time
- **Topic Analysis**: See how you perform in different topics
- **Weak Areas**: Identify areas that need improvement
- **Statistics**: Comprehensive interview statistics

### 🔐 Authentication
- **Secure Login/Register**: JWT-based authentication
- **Protected Routes**: Role-based access control
- **Auto Logout**: Automatic logout on token expiration
- **Session Management**: Persistent login across page refreshes

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB 9.2.4
- **Authentication**: JWT + bcryptjs
- **AI Engine**: Google Generative AI
- **Others**: CORS, Cookie-Parser, dotenv

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.3
- **Routing**: React Router DOM 7.15.0
- **HTTP Client**: Axios 1.6.2
- **Styling**: CSS3 (Gradients, Animations, Grid, Flexbox)

### Database
- **MongoDB**: NoSQL database for flexible schema
- **Collections**: Users, Interviews, Questions, Resumes

## 📦 Project Structure

```
GenAI/
├── src/                          # Backend (Node.js/Express)
│   ├── server.js                # Entry point
│   ├── app.js                   # Express app configuration
│   ├── authMiddleware.js        # JWT authentication
│   ├── config/                  # Database configuration
│   ├── models/                  # MongoDB schemas
│   │   ├── Interview.js        # Interview model
│   │   ├── Question.js         # Question model
│   │   ├── Resume.js           # Resume model
│   │   ├── User.js             # User model
│   │   └── ai.service.js       # Google GenAI service
│   ├── controllers/             # Business logic
│   │   ├── interview.controller.js
│   │   ├── analytics.controller.js
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   └── routes/                  # API routes
│       ├── interview.routes.js
│       ├── analytics.routes.js
│       ├── auth.routes.js
│       └── user.routes.js
│
└── frontend/                     # React Frontend (Vite)
    └── src/
        ├── App.jsx             # Main app component with routing
        ├── pages/              # Page components
        │   ├── AuthPage.jsx
        │   ├── DashboardPage.jsx
        │   ├── ProfilePage.jsx
        │   ├── InterviewStartPage.jsx
        │   ├── InterviewPracticePage.jsx
        │   └── InterviewResultsPage.jsx
        ├── components/         # Reusable components
        ├── services/          # API service layer
        │   └── api.js         # Axios instance with interceptors
        ├── context/           # State management
        │   └── AuthContext.jsx
        ├── hooks/             # Custom hooks
        └── styles/            # CSS files
            ├── interview.css
            ├── results.css
            ├── interview-start.css
            └── dashboard.css
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB cluster (local or cloud)
- Google Generative AI API key

### Backend Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Variables** (create `.env` in root)
```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/interview-ai
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_AI_KEY=your_google_genai_api_key
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

3. **Start Backend**
```bash
npm run dev
# Backend runs on http://localhost:3000
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Environment Variables** (create `.env` in frontend folder)
```env
VITE_API_URL=http://localhost:3000/api
```

3. **Start Frontend**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

4. **Build for Production**
```bash
npm run build
# Creates optimized build in dist/ folder
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/user/me` - Get current user profile

### Interviews
- `POST /api/interviews/start` - Start new interview
- `POST /api/interviews/:id/submit` - Submit answer
- `POST /api/interviews/:id/end` - End interview
- `POST /api/interviews/:id/skip` - Skip question
- `GET /api/interviews/:id` - Get interview details
- `GET /api/interviews` - Get interview history
- `GET /api/interviews/:id/question/:questionId/hint` - Get hint

### Analytics
- `GET /api/analytics/summary` - Get summary statistics
- `GET /api/analytics/topics` - Get performance by topic
- `GET /api/analytics/trends` - Get performance trends
- `GET /api/analytics/weak-areas` - Get weak areas to improve

## 🎮 Usage Guide

### Starting Your First Interview

1. **Login/Register**
   - Visit http://localhost:5173
   - Create account or login

2. **Start Interview**
   - Click "Start New Interview"
   - Select topic (JavaScript, Python, React, etc.)
   - Choose difficulty (Easy, Medium, Hard)
   - Select number of questions (5-20)

3. **Practice**
   - Read each question carefully
   - Type your answer in the text area
   - Get AI feedback and score
   - Move to next question
   - Complete interview to see results

4. **Review Results**
   - See overall score and accuracy
   - Read AI feedback and suggestions
   - View detailed question breakdown
   - Check weak areas identified

5. **Track Progress**
   - Visit Dashboard to see analytics
   - Track performance trends
   - View interview history
   - Identify areas to improve

## 🎨 UI/UX Features

### Modern Design
- **Color Scheme**: Professional blue (#0A66C2) with sky blue accents
- **Responsive**: Mobile, tablet, and desktop optimized
- **Animations**: Smooth transitions and microinteractions
- **Accessibility**: WCAG AA compliant with high contrast

### User Experience
- **Clear Navigation**: Intuitive menu and routing
- **Progressive Disclosure**: Show info as needed
- **Real-time Feedback**: Instant question submission feedback
- **Progress Indication**: Visual progress bars and timers
- **Error Handling**: Clear error messages and recovery

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcryptjs with salt rounds
- **CORS Protection**: Restricted cross-origin requests
- **Protected Routes**: Authentication required for sensitive endpoints
- **Token Expiration**: Auto logout on token expiration
- **Input Validation**: Server-side validation for all inputs

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date
}
```

### Interviews Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref User),
  topic: String,
  difficulty: String,
  questions: [Array],
  userAnswers: [Array],
  scores: [Array],
  overallScore: Number,
  status: String,
  createdAt: Date,
  completedAt: Date
}
```

### Questions Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  topic: String,
  difficulty: String,
  expectedAnswer: String,
  hints: [Array],
  isGenerated: Boolean,
  createdAt: Date
}
```

## 🤖 AI Integration

### Question Generation
```javascript
const questions = await aiService.generateQuestions(
  'JavaScript',
  'Medium',
  10
);
```

### Answer Evaluation
```javascript
const evaluation = await aiService.evaluateAnswer(
  questionTitle,
  userAnswer,
  expectedAnswer
);
```

### Overall Feedback
```javascript
const feedback = await aiService.generateOverallFeedback(
  interviewData
);
```

## ⚙️ Configuration

### Environment Variables

**Backend (.env)**
```env
# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/db

# Authentication
JWT_SECRET=your_secret_key_min_32_chars_recommended

# AI
GOOGLE_AI_KEY=your_google_genai_key

# Server
PORT=3000
NODE_ENV=development|production

# Frontend
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3000/api
```

## 📈 Performance Optimization

### Frontend
- Code splitting with React Router
- Lazy loading of components
- Image optimization
- CSS minification
- Bundle size optimization

### Backend
- Database indexing on frequently queried fields
- Request/response compression with gzip
- API rate limiting
- Caching strategies
- Efficient query optimization

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration works
- [ ] User login works
- [ ] Protected routes redirect properly
- [ ] Start interview loads questions
- [ ] Submit answer provides feedback
- [ ] End interview calculates scores
- [ ] Dashboard displays analytics
- [ ] Profile page shows user info
- [ ] Logout clears session

### Postman Collection
Import available in `/docs/postman-collection.json`

## 📝 API Response Format

All responses follow consistent format:

**Success Response**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Error Response**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🚨 Error Handling

The application includes comprehensive error handling:
- HTTP status codes (400, 401, 403, 404, 500)
- Descriptive error messages
- Request validation
- Database error handling
- API call error handling with retries

## 📱 Mobile Responsiveness

All pages are fully responsive:
- **Mobile**: Optimized for 320px+ screens
- **Tablet**: 641px - 1024px layouts
- **Desktop**: 1025px+ full-featured experience
- **Touch-friendly**: 44x44px minimum touch targets

## 🔄 Authentication Flow

1. **User registers** → Account created, stored in MongoDB
2. **User logs in** → JWT token generated
3. **Token stored** → localStorage for persistence
4. **API requests** → Token attached to Authorization header
5. **Response 401** → Auto logout, redirect to login
6. **Token refresh** → Handled via interceptors
7. **User logout** → Token cleared, localStorage emptied

## 🎯 Feature Roadmap

- ✅ User authentication
- ✅ Interview practice
- ✅ AI-powered evaluation
- ✅ Analytics dashboard
- ⏳ Resume upload & parsing
- ⏳ Video recording
- ⏳ Voice input for answers
- ⏳ Interview scheduling
- ⏳ Performance reports
- ⏳ Social sharing

## 📄 License

ISC

## 👨‍💻 Development

### Run both servers simultaneously
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Hot Reload
Both Vite (frontend) and Node.js (backend) support hot reload during development.

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📞 Support

For issues or questions:
1. Check error messages
2. Review logs in browser console and server terminal
3. Check MongoDB Atlas connection
4. Verify Google GenAI API key

## 🎉 Production Deployment

### Deploy Backend
- Push to GitHub
- Connect to Heroku/Railway/Render
- Set environment variables
- Deploy

### Deploy Frontend
- Build: `npm run build`
- Deploy to Vercel/Netlify
- Set API URL to production backend

## 📊 Project Stats

- **Lines of Code**: ~3000+
- **Components**: 15+
- **API Endpoints**: 15+
- **Database Models**: 5
- **CSS Lines**: 1500+
- **Documentation**: Complete

---

**Last Updated**: 2024  
**Status**: Production Ready ✅  
**Version**: 1.0.0  

Enjoy practicing with Interview AI! 🚀
