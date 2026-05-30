import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Generate questions based on topic and difficulty
export const generateQuestions = async (topic, difficulty, count = 10) => {
  try {
    const prompt = `Generate ${count} technical interview questions about "${topic}" with difficulty level "${difficulty}".

For each question, provide:
1. Question title
2. Full description
3. Expected answer points (as a list)
4. One hint
5. Estimated time (in minutes)

Format as JSON array with objects containing: title, description, answerKeyPoints (array), hint, estimatedTime

Return ONLY valid JSON array, no markdown or extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from AI response');
    }
    
    const questions = JSON.parse(jsonMatch[0]);
    return questions.slice(0, count);
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
};

// Evaluate user's answer
export const evaluateAnswer = async (question, userAnswer, expectedAnswer) => {
  try {
    const prompt = `You are an expert technical interviewer. Evaluate the following answer to a technical interview question.

Question: "${question}"

Expected Answer (key points): "${expectedAnswer}"

User's Answer: "${userAnswer}"

Provide evaluation in JSON format with:
{
  "score": (0-100),
  "accuracy": (0-100),
  "isCorrect": (boolean),
  "strengths": [array of good points],
  "weaknesses": [array of missing points],
  "feedback": "detailed feedback string",
  "keyPointsCovered": [array of covered key points],
  "keyPointsMissed": [array of missed key points],
  "suggestions": [array of improvement suggestions]
}

Return ONLY valid JSON, no markdown or extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract evaluation from AI response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error evaluating answer:', error);
    throw new Error(`Failed to evaluate answer: ${error.message}`);
  }
};

// Generate overall feedback for interview
export const generateOverallFeedback = async (interviewData) => {
  try {
    const answersAnalysis = interviewData.scores
      .map((s, i) => `Q${i + 1}: ${s.feedback}`)
      .join('\n');

    const prompt = `Analyze the following interview performance and provide comprehensive feedback.

Interview Topic: ${interviewData.topic}
Difficulty: ${interviewData.difficulty}
Overall Score: ${interviewData.overallScore}/100
Duration: ${Math.round(interviewData.totalDuration / 60)} minutes

Individual Question Feedback:
${answersAnalysis}

Provide feedback in JSON format with:
{
  "strengths": [array of 3-5 strengths shown during interview],
  "weaknesses": [array of 3-5 areas needing improvement],
  "improvements": [array of 5-7 specific action items],
  "overallAnalysis": "2-3 sentence summary of performance",
  "nextSteps": [array of recommended topics to study],
  "confidenceLevel": "Low/Medium/High",
  "recommendedDifficulty": "Easy/Medium/Hard (for next interview)"
}

Return ONLY valid JSON, no markdown or extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract feedback from AI response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating feedback:', error);
    throw new Error(`Failed to generate feedback: ${error.message}`);
  }
};

// Generate hint for a question
export const generateHint = async (questionTitle, questionDescription) => {
  try {
    const prompt = `Provide a helpful hint for this technical interview question without giving away the answer.

Question: "${questionTitle}"
Description: "${questionDescription}"

The hint should guide the interviewee toward the solution without directly revealing the answer.
Keep it concise (1-2 sentences max).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Error generating hint:', error);
    throw new Error(`Failed to generate hint: ${error.message}`);
  }
};

// Extract topics from resume
export const extractTopicsFromResume = async (resumeText) => {
  try {
    const prompt = `Analyze this resume and extract relevant technical topics that could be covered in a technical interview.

Resume:
${resumeText}

Return a JSON object with:
{
  "technologies": [array of technologies mentioned],
  "skills": [array of skills],
  "suggestedTopics": [array of recommended interview topics based on resume],
  "difficultyLevel": "Easy/Medium/Hard (suggested difficulty for interview)",
  "strongAreas": [array of strong technical areas],
  "potentialWeakAreas": [array of areas that might need practice]
}

Return ONLY valid JSON, no markdown or extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract topics from resume');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error extracting topics:', error);
    throw new Error(`Failed to extract topics: ${error.message}`);
  }
};

export default {
  generateQuestions,
  evaluateAnswer,
  generateOverallFeedback,
  generateHint,
  extractTopicsFromResume
};
