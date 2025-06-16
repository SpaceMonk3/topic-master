// Type definitions for JavaScript (using JSDoc comments for better IDE support)

/**
 * @typedef {Object} User
 * @property {string} uid
 * @property {string} email
 * @property {string} [displayName]
 * @property {string} [photoURL]
 */

/**
 * @typedef {Object} Quiz
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {Question[]} questions
 * @property {Date} createdAt
 * @property {string} createdBy
 * @property {'easy'|'medium'|'hard'} difficulty
 * @property {string} subject
 * @property {number} [timeLimit]
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} question
 * @property {string[]} options
 * @property {number} correctAnswer
 * @property {string} [explanation]
 * @property {'easy'|'medium'|'hard'} difficulty
 */

/**
 * @typedef {Object} QuizSession
 * @property {string} id
 * @property {string} quizId
 * @property {string} userId
 * @property {UserAnswer[]} answers
 * @property {number} score
 * @property {number} totalQuestions
 * @property {Date} completedAt
 * @property {number} timeSpent
 * @property {Quiz} quiz
 */

/**
 * @typedef {Object} UserAnswer
 * @property {string} questionId
 * @property {number} selectedAnswer
 * @property {boolean} isCorrect
 * @property {number} timeSpent
 */

/**
 * @typedef {Object} QuizStats
 * @property {number} totalQuizzes
 * @property {number} averageScore
 * @property {number} totalTimeSpent
 * @property {string[]} strongestSubjects
 * @property {string[]} weakestSubjects
 * @property {number[]} recentPerformance
 */

/**
 * @typedef {Object} LectureNotes
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} subject
 * @property {Date} uploadedAt
 * @property {string} userId
 */

export {};