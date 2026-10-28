const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide course title'],
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide course category/subject'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide course description'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    iconName: {
      type: String,
      default: 'BookOpen',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    learningObjectives: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for lessons
courseSchema.virtual('lessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'course',
  justOne: false,
});

module.exports = mongoose.model('Course', courseSchema);
