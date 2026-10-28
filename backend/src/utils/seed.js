const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Assessment = require('../models/Assessment');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const Notification = require('../models/Notification');

const coursesData = require('./seedData/courses');
const javaQ = require('./seedData/javaQuestions');
const webQ = require('./seedData/webQuestions');
const dbQ = require('./seedData/dbQuestions');
const cyberQ = require('./seedData/cyberQuestions');
const cloudQ = require('./seedData/cloudQuestions');
const pythonQ = require('./seedData/pythonQuestions');

const questionsMap = {
  'Java Programming': javaQ,
  'Web Development': webQ,
  'Database Management': dbQ,
  'Cyber Security': cyberQ,
  'Cloud Computing': cloudQ,
  'Python Programming': pythonQ,
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edtech_learning_portal');

    const instructorFilter = process.env.SEED_INSTRUCTOR_EMAIL
      ? {
          email: process.env.SEED_INSTRUCTOR_EMAIL.trim().toLowerCase(),
          role: 'instructor',
          status: 'active',
        }
      : { role: 'instructor', status: 'active' };
    const instructor = await User.findOne(instructorFilter).sort({ createdAt: 1 });
    if (!instructor) {
      throw new Error('Create an instructor account and set SEED_INSTRUCTOR_EMAIL before seeding course content.');
    }

    console.log('Clearing existing course and learning data...');
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Assessment.deleteMany({});
    await Quiz.deleteMany({});
    await Result.deleteMany({});
    await Enrollment.deleteMany({});
    await Progress.deleteMany({});
    await Notification.deleteMany({});

    let totalAssessmentQuestions = 0;
    let totalQuizQuestions = 0;

    for (const courseData of coursesData) {
      const course = await Course.create({
        title: courseData.title,
        slug: courseData.title.toLowerCase().replace(/\s+/g, '-'),
        category: courseData.category,
        description: courseData.description,
        instructor: instructor._id,
        level: courseData.level,
        thumbnail: courseData.thumbnail,
        iconName: courseData.iconName,
        learningObjectives: courseData.learningObjectives,
        status: 'published',
        enrolledCount: 0,
      });

      for (const lessonData of courseData.lessons) {
        await Lesson.create({
          course: course._id,
          lessonTitle: lessonData.lessonTitle,
          contentType: lessonData.contentType,
          durationMinutes: lessonData.durationMinutes,
          order: lessonData.order,
          contentUrl: lessonData.contentUrl,
          description: lessonData.description,
          notesContent: lessonData.notesContent,
          pdfUrl: lessonData.pdfUrl || '',
        });
      }

      const questionData = questionsMap[courseData.category];
      if (!questionData) {
        continue;
      }

      await Assessment.create({
        course: course._id,
        title: `${courseData.title} Comprehensive Assessment`,
        subject: courseData.category,
        description: `Standard 30-question formal assessment testing conceptual understanding, syntax mastery, and problem-solving in ${courseData.title}.`,
        questions: questionData.assessmentQuestions,
        totalMarks: 30,
        passingPercentage: 50,
        createdBy: instructor._id,
      });
      totalAssessmentQuestions += questionData.assessmentQuestions.length;

      await Quiz.create({
        course: course._id,
        title: `${courseData.title} Speed Quiz`,
        subject: courseData.category,
        durationMinutes: 20,
        totalMarks: 20,
        questions: questionData.quizQuestions,
        createdBy: instructor._id,
      });
      totalQuizQuestions += questionData.quizQuestions.length;
    }

    console.log(`Created ${coursesData.length} courses, lessons, assessments, and quizzes.`);
    console.log(`Assessment questions seeded: ${totalAssessmentQuestions}`);
    console.log(`Quiz questions seeded: ${totalQuizQuestions}`);
    console.log('No user accounts were created or modified.');
  } catch (error) {
    console.error('Seeding failed. Check the MongoDB connection and seed configuration.');
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();
