const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      validate: [val => val.length === 4, 'Quiz question must have exactly 4 options'],
      required: true,
    },
    correctAnswer: {
      type: Number,
      required: true, // 0, 1, 2, or 3
      min: 0,
      max: 3,
    },
    explanation: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    durationMinutes: {
      type: Number,
      default: 20,
      required: true,
    },
    totalMarks: {
      type: Number,
      default: 20,
    },
    questions: [quizQuestionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
