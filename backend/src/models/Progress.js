const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    totalLessons: {
      type: Number,
      default: 0,
    },
    completionPercentage: {
      type: Number,
      default: 0,
    },
    hasCompletedAssessment: {
      type: Boolean,
      default: false,
    },
    hasCompletedQuiz: {
      type: Boolean,
      default: false,
    },
    lastAccessedLesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
