require('dotenv').config();

/**
 * OpenAI Configuration (GPT-4)
 * Used for: Q&A chatbot, report summarization, content generation
 */
const openaiConfig = {
  // API key from OpenAI platform
  apiKey: process.env.OPENAI_API_KEY || '',
  
  // Model selection
  model: process.env.OPENAI_MODEL || 'gpt-4',
  
  // Alternative models
  models: {
    gpt4: 'gpt-4',
    gpt4Turbo: 'gpt-4-turbo-preview',
    gpt35: 'gpt-3.5-turbo'
  },
  
  // API endpoint
  apiUrl: 'https://api.openai.com/v1',
  
  // Token limits
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
  
  // Temperature (0-2, higher = more creative)
  temperature: 0.7,
  
  // Timeout for requests (ms)
  timeout: 30000, // 30 seconds
  
  // Retry configuration
  retries: 3,
  retryDelay: 1000 // ms
};

/**
 * Python ML Service Configuration
 * Used for: Grade prediction, student risk analysis, pattern detection
 */
const mlServiceConfig = {
  // ML service URL (Python Flask/FastAPI service)
  baseUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  
  // API endpoints
  endpoints: {
    predict: '/api/predict',
    train: '/api/train',
    evaluate: '/api/evaluate',
    health: '/health'
  },
  
  // Request timeout (ms)
  timeout: 60000, // 60 seconds for ML operations
  
  // Feature flags
  enabled: process.env.ML_SERVICE_ENABLED === 'true',
  
  // Retry configuration
  retries: 2,
  retryDelay: 2000
};

/**
 * AI Feature Flags
 * Enable/disable specific AI features
 */
const aiFeatures = {
  // Q&A Chatbot (OpenAI)
  chatbot: {
    enabled: process.env.AI_CHATBOT_ENABLED === 'true',
    maxHistoryLength: 10, // Number of previous messages to include
    systemPrompt: 'You are a helpful AI assistant for a school management system.'
  },
  
  // Grade Prediction (ML)
  gradePrediction: {
    enabled: process.env.AI_GRADE_PREDICTION_ENABLED === 'true',
    confidenceThreshold: 0.7, // Minimum confidence to show prediction
    lookAheadWeeks: 4 // Predict grades N weeks ahead
  },
  
  // Student Risk Detection (ML)
  riskDetection: {
    enabled: process.env.AI_RISK_DETECTION_ENABLED === 'true',
    riskThreshold: 0.6, // 0-1, higher = more students flagged
    checkFrequency: 'weekly' // daily, weekly, monthly
  },
  
  // Report Generation (OpenAI)
  reportGeneration: {
    enabled: process.env.AI_REPORT_GENERATION_ENABLED === 'true',
    maxReportLength: 1000, // tokens
    templates: ['summary', 'detailed', 'parent-friendly']
  },
  
  // Course Recommendations (ML)
  courseRecommendation: {
    enabled: false, // Phase 2 feature
    topN: 5 // Number of recommendations to return
  }
};

/**
 * AI Model Configurations
 * Specific settings for different ML models
 */
const modelConfigs = {
  // Grade predictor model
  gradePredictor: {
    modelPath: process.env.GRADE_PREDICTOR_MODEL || './ai-service/models/grade_predictor.pkl',
    features: [
      'attendance_rate',
      'previous_grades_avg',
      'quiz_scores_avg',
      'assignment_completion_rate',
      'study_time_hours'
    ],
    targetVariable: 'final_grade'
  },
  
  // Student risk classifier
  riskClassifier: {
    modelPath: process.env.RISK_CLASSIFIER_MODEL || './ai-service/models/risk_classifier.pkl',
    features: [
      'attendance_rate',
      'grade_trend',
      'missing_assignments',
      'participation_score',
      'previous_failures'
    ],
    classes: ['low_risk', 'medium_risk', 'high_risk']
  }
};

/**
 * AI Response Caching
 * Cache AI responses to reduce API costs
 */
const cachingConfig = {
  enabled: process.env.AI_CACHING_ENABLED === 'true',
  ttl: 3600, // Time to live (seconds) - 1 hour
  maxSize: 1000 // Maximum cached items
};

/**
 * AI Monitoring & Logging
 */
const monitoringConfig = {
  // Log all AI requests
  logRequests: process.env.NODE_ENV !== 'production',
  
  // Track token usage
  trackTokenUsage: true,
  
  // Alert thresholds
  alerts: {
    dailyTokenLimit: 100000,
    errorRateThreshold: 0.05 // 5% error rate triggers alert
  }
};

module.exports = {
  openaiConfig,
  mlServiceConfig,
  aiFeatures,
  modelConfigs,
  cachingConfig,
  monitoringConfig
};
