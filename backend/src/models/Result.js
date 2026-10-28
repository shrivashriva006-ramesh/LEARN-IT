const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemType: {
      type: String,
      enum: ['assessment', 'quiz'],
      required: true,
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    subject: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    incorrectAnswers: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      default: true,
    },
    answersSummary: [
      {
        questionNumber: Number,
        questionText: String,
        selectedOption: Number,
        correctOption: Number,
        isCorrect: Boolean,
        options: [String],
        explanation: String,
      },
    ],
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Result', resultSchema);
