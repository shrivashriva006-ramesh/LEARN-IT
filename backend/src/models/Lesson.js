const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lessonTitle: {
      type: String,
      required: [true, 'Please provide lesson title'],
      trim: true,
    },
    contentType: {
      type: String,
      enum: ['video', 'notes', 'pdf'],
      default: 'video',
      required: true,
    },
    contentUrl: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    notesContent: {
      type: String,
      default: '',
    },
    pdfUrl: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 1,
    },
    durationMinutes: {
      type: Number,
      default: 15,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', lessonSchema);
