
const { performance } = require('perf_hooks');

// Simulation of the Database and Model
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const DB_LATENCY = 10; // 10ms latency per DB call

const QuestionModel = {
  increment: async (fields, options) => {
    await sleep(DB_LATENCY);
    return true;
  }
};

class Question {
  constructor(id, type) {
    this.id = id;
    this.question_type = type;
    this.points = 10;
    this.times_answered = 0;
    this.times_correct = 0;
  }

  isAutoGradable() {
    return ['multiple_choice', 'true_false', 'short_answer', 'fill_blank'].includes(this.question_type);
  }

  checkAnswer(answer) {
    return answer === 'correct';
  }

  async updateStatistics(isCorrect) {
    this.times_answered += 1;
    if (isCorrect) {
      this.times_correct += 1;
    }
    // Simulate save()
    await sleep(DB_LATENCY);
  }
}

// Generate data
const NUM_QUESTIONS = 100;
const questions = Array.from({ length: NUM_QUESTIONS }, (_, i) => new Question(i, 'multiple_choice'));
const answers = {};
questions.forEach(q => {
  answers[q.id] = Math.random() > 0.5 ? 'correct' : 'wrong';
});

// Original Implementation
async function originalImplementation() {
  const start = performance.now();

  for (const question of questions) {
    const studentAnswer = answers[question.id];

    if (question.isAutoGradable()) {
      const isCorrect = question.checkAnswer(studentAnswer);
      await question.updateStatistics(isCorrect);
    }
  }

  const end = performance.now();
  return end - start;
}

// Optimized Implementation
async function optimizedImplementation() {
  const start = performance.now();

  const updates = {
    correct: [],
    incorrect: []
  };

  for (const question of questions) {
    const studentAnswer = answers[question.id];

    if (question.isAutoGradable()) {
      const isCorrect = question.checkAnswer(studentAnswer);

      if (isCorrect) {
        updates.correct.push(question.id);
      } else {
        updates.incorrect.push(question.id);
      }
    }
  }

  // Bulk updates
  const promises = [];
  if (updates.correct.length > 0) {
    promises.push(QuestionModel.increment(
      { times_answered: 1, times_correct: 1 },
      { where: { id: updates.correct } }
    ));
  }

  if (updates.incorrect.length > 0) {
    promises.push(QuestionModel.increment(
      { times_answered: 1 },
      { where: { id: updates.incorrect } }
    ));
  }

  await Promise.all(promises);

  const end = performance.now();
  return end - start;
}

async function runBenchmark() {
  console.log(`Running benchmark with ${NUM_QUESTIONS} questions and ${DB_LATENCY}ms simulated DB latency...`);

  const originalTime = await originalImplementation();
  console.log(`Original Implementation: ${originalTime.toFixed(2)}ms`);

  const optimizedTime = await optimizedImplementation();
  console.log(`Optimized Implementation: ${optimizedTime.toFixed(2)}ms`);

  const improvement = originalTime / optimizedTime;
  console.log(`Speedup: ${improvement.toFixed(2)}x`);
}

runBenchmark();
