/**
 * AI Service
 * ===========
 * Handles all AI-related operations using OpenAI GPT-4
 */

const axios = require('axios');
const { openaiConfig } = require('../config/ai');

class AIService {
  constructor() {
    this.apiKey = openaiConfig.apiKey;
    this.apiUrl = openaiConfig.apiUrl;
    this.model = openaiConfig.model;
    this.conversationHistory = new Map(); // Store per-user conversation history
  }

  /**
   * Chat with AI Assistant
   * @param {string} userId - User ID
   * @param {string} message - User message
   * @param {string} context - Additional context (role, student data, etc.)
   * @returns {Promise<string>} AI response
   */
  async chat(userId, message, context = {}) {
    try {
      // Get or create conversation history
      if (!this.conversationHistory.has(userId)) {
        this.conversationHistory.set(userId, []);
      }
      const history = this.conversationHistory.get(userId);

      // Build system prompt based on context
      const systemPrompt = this.buildSystemPrompt(context);

      // Build messages array
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-10), // Last 10 messages for context
        { role: 'user', content: message }
      ];

      // Call OpenAI API
      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: this.model,
          messages: messages,
          max_tokens: openaiConfig.maxTokens,
          temperature: openaiConfig.temperature
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: openaiConfig.timeout
        }
      );

      const aiResponse = response.data.choices[0].message.content;

      // Update conversation history
      history.push({ role: 'user', content: message });
      history.push({ role: 'assistant', content: aiResponse });

      // Keep only last 20 messages
      if (history.length > 20) {
        history.splice(0, history.length - 20);
      }

      return aiResponse;
    } catch (error) {
      console.error('AI Chat Error:', error.response?.data || error.message);
      throw new Error('Không thể kết nối với AI assistant. Vui lòng thử lại.');
    }
  }

  /**
   * Clear conversation history for a user
   */
  clearHistory(userId) {
    this.conversationHistory.delete(userId);
  }

  /**
   * Build system prompt based on user context
   */
  buildSystemPrompt(context) {
    const { role, name, language = 'Vietnamese' } = context;

    let prompt = `You are an intelligent AI assistant for an educational management system.
Always respond in ${language}.`;

    if (role === 'student') {
      prompt += `\n\nYou are helping a student named ${name || 'Student'}.
Your role is to:
- Answer questions about assignments, courses, and grades
- Provide study tips and learning strategies
- Help with homework and exam preparation
- Motivate and encourage learning
- Explain concepts in a simple, student-friendly way`;
    } else if (role === 'teacher') {
      prompt += `\n\nYou are assisting a teacher named ${name || 'Teacher'}.
Your role is to:
- Help with lesson planning and curriculum design
- Suggest teaching strategies and assessment methods
- Provide insights on student performance
- Assist with grading and feedback
- Recommend educational resources`;
    } else if (role === 'admin') {
      prompt += `\n\nYou are supporting a school administrator.
Your role is to:
- Provide insights on school performance metrics
- Suggest improvements for academic programs
- Help with policy and decision-making
- Analyze trends and patterns
- Generate reports and summaries`;
    }

    prompt += `\n\nBe helpful, friendly, and professional. If you don't know something, admit it honestly.`;

    return prompt;
  }

  /**
   * Generate study recommendations for a student
   */
  async generateStudyRecommendations(studentData) {
    try {
      const { name, grades, weakSubjects, strengths } = studentData;

      const prompt = `Analyze this student's performance and provide personalized study recommendations:

Student: ${name}
Average Grade: ${grades.average}/10
Weak Subjects: ${weakSubjects.join(', ')}
Strong Subjects: ${strengths.join(', ')}

Please provide:
1. Top 3 specific study recommendations
2. Time management tips
3. Suggested focus areas for improvement
4. Motivational advice

Format your response in Vietnamese with clear bullet points.`;

      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 800,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: openaiConfig.timeout
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Recommendation Error:', error.response?.data || error.message);
      throw new Error('Không thể tạo gợi ý học tập');
    }
  }

  /**
   * Predict student performance trend
   */
  predictPerformanceTrend(grades) {
    // Calculate trend using linear regression
    if (grades.length < 2) {
      return { trend: 'insufficient_data', prediction: null };
    }

    // Simple linear regression
    const n = grades.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    grades.forEach((grade, index) => {
      const x = index + 1;
      const y = parseFloat(grade.score);
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict next grade
    const nextX = n + 1;
    const prediction = slope * nextX + intercept;

    // Determine trend
    let trend;
    if (slope > 0.3) trend = 'improving';
    else if (slope < -0.3) trend = 'declining';
    else trend = 'stable';

    return {
      trend,
      prediction: Math.max(0, Math.min(10, prediction)).toFixed(2),
      slope: slope.toFixed(3),
      confidence: this.calculateConfidence(grades)
    };
  }

  /**
   * Calculate confidence level based on grade variance
   */
  calculateConfidence(grades) {
    const scores = grades.map(g => parseFloat(g.score));
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    // Lower std dev = higher confidence
    if (stdDev < 0.5) return 'high';
    if (stdDev < 1.5) return 'medium';
    return 'low';
  }

  /**
   * Generate course recommendations based on student interests and performance
   */
  async generateCourseRecommendations(studentProfile) {
    try {
      const { interests, completedCourses, avgGrade, careerGoals } = studentProfile;

      const prompt = `Based on this student profile, recommend 5 relevant courses:

Interests: ${interests.join(', ')}
Completed Courses: ${completedCourses.join(', ')}
Average Grade: ${avgGrade}/10
Career Goals: ${careerGoals}

For each recommendation, provide:
- Course name
- Why it's recommended
- Expected difficulty level
- How it aligns with career goals

Respond in Vietnamese.`;

      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.8
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: openaiConfig.timeout
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Course Recommendation Error:', error.response?.data || error.message);
      throw new Error('Không thể tạo gợi ý khóa học');
    }
  }

  /**
   * Generate report summary using AI
   */
  async generateReportSummary(reportData) {
    try {
      const { studentName, grades, attendance, behavior, period } = reportData;

      const prompt = `Generate a comprehensive report summary for this student:

Student: ${studentName}
Period: ${period}
Average Grade: ${grades.average}/10
Attendance Rate: ${attendance.rate}%
Behavior Score: ${behavior.score}/10

Subjects:
${grades.subjects.map(s => `- ${s.name}: ${s.score}/10`).join('\n')}

Please write:
1. Overall Performance Summary
2. Strengths and Achievements
3. Areas for Improvement
4. Specific Recommendations for Parents
5. Next Steps

Write in Vietnamese, professional yet warm tone suitable for parents.`;

      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1200,
          temperature: 0.6
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: openaiConfig.timeout
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Report Generation Error:', error.response?.data || error.message);
      throw new Error('Không thể tạo báo cáo tóm tắt');
    }
  }
}

module.exports = new AIService();
