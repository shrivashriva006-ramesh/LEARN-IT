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
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edtech_learning_portal';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Connected! Purging existing collections...');

    await User.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Assessment.deleteMany({});
    await Quiz.deleteMany({});
    await Result.deleteMany({});
    await Enrollment.deleteMany({});
    await Progress.deleteMany({});
    await Notification.deleteMany({});

    console.log('Collections cleared.');

    // 1. Create Default Users (Admin, Instructor, Student)
    console.log('Creating default users...');
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@edtech.com',
      password: 'Admin@123',
      role: 'admin',
      status: 'active',
      bio: 'Head of Ed Tech Academic System & Portal Infrastructure.',
    });

    const instructorUser = await User.create({
      name: 'Prof. Divyanjali Sharma',
      email: 'instructor@edtech.com',
      password: 'Instructor@123',
      role: 'instructor',
      status: 'active',
      bio: 'Lead Technical Trainer & Assistant Professor in Computer Science and Cyber Security.',
    });

    const studentUser = await User.create({
      name: 'R. Shriva',
      email: 'student@edtech.com',
      password: 'Student@123',
      role: 'student',
      status: 'active',
      bio: 'B.Tech CSE (Cyber Security) Student & Full Stack Enthusiast.',
    });

    console.log('Users created:');
    console.log(`- Admin: admin@edtech.com / Admin@123`);
    console.log(`- Instructor: instructor@edtech.com / Instructor@123`);
    console.log(`- Student: student@edtech.com / Student@123`);

    // 2. Create Courses, Lessons, Assessments, and Quizzes
    let totalAssessQCount = 0;
    let totalQuizQCount = 0;

    const createdCourses = [];

    for (const cData of coursesData) {
      const course = await Course.create({
        title: cData.title,
        slug: cData.title.toLowerCase().replace(/\s+/g, '-'),
        category: cData.category,
        description: cData.description,
        instructor: instructorUser._id,
        level: cData.level,
        thumbnail: cData.thumbnail,
        iconName: cData.iconName,
        learningObjectives: cData.learningObjectives,
        status: 'published',
        enrolledCount: 1, // student enrolled
      });

      createdCourses.push(course);

      // Create lessons for this course
      const createdLessons = [];
      for (const lData of cData.lessons) {
        const lesson = await Lesson.create({
          course: course._id,
          lessonTitle: lData.lessonTitle,
          contentType: lData.contentType,
          durationMinutes: lData.durationMinutes,
          order: lData.order,
          contentUrl: lData.contentUrl,
          description: lData.description,
          notesContent: lData.notesContent,
          pdfUrl: lData.pdfUrl || '',
        });
        createdLessons.push(lesson);
      }

      // Create Assessment for this course (Exactly 30 questions)
      const qData = questionsMap[cData.category];
      if (qData) {
        const assessment = await Assessment.create({
          course: course._id,
          title: `${cData.title} Comprehensive Assessment`,
          subject: cData.category,
          description: `Standard 30-question formal assessment testing conceptual understanding, syntax mastery, and problem-solving in ${cData.title}.`,
          questions: qData.assessmentQuestions,
          totalMarks: 30,
          passingPercentage: 50,
          createdBy: instructorUser._id,
        });
        totalAssessQCount += qData.assessmentQuestions.length;

        // Create Quiz for this course (Exactly 20 questions)
        const quiz = await Quiz.create({
          course: course._id,
          title: `${cData.title} Speed Quiz`,
          subject: cData.category,
          durationMinutes: 20,
          totalMarks: 20,
          questions: qData.quizQuestions,
          createdBy: instructorUser._id,
        });
        totalQuizQCount += qData.quizQuestions.length;
      }
    }

    console.log(`Created ${createdCourses.length} courses with lessons, assessments, and quizzes.`);
    console.log(`Total Assessment Questions Seeded: ${totalAssessQCount} (Target: 180)`);
    console.log(`Total Quiz Questions Seeded: ${totalQuizQCount} (Target: 120)`);

    // 3. Enroll default student into courses & initialize progress
    console.log('Enrolling default student in courses...');
    for (let i = 0; i < createdCourses.length; i++) {
      const course = createdCourses[i];
      const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 });

      await Enrollment.create({
        student: studentUser._id,
        course: course._id,
        enrolledAt: new Date(Date.now() - (i * 86400000)), // staggered days
        completionStatus: i === 0 ? 'in-progress' : 'in-progress',
      });

      // Give student 1 completed lesson in first two courses to demo real progress tracking!
      const completedLessons = i < 2 && lessons.length > 0 ? [lessons[0]._id] : [];
      const lessonRatio = lessons.length > 0 ? completedLessons.length / lessons.length : 0;
      const initialPercent = Math.round(lessonRatio * 60);

      await Progress.create({
        student: studentUser._id,
        course: course._id,
        completedLessons,
        totalLessons: lessons.length,
        completionPercentage: initialPercent,
        hasCompletedAssessment: false,
        hasCompletedQuiz: false,
        lastAccessedLesson: lessons[0] ? lessons[0]._id : null,
      });
    }

    // 4. Seed initial sample assessment result for the student in Java Programming
    const firstCourse = createdCourses[0];
    const javaAssessment = await Assessment.findOne({ course: firstCourse._id });
    if (javaAssessment) {
      // Simulate completed assessment attempt (score 26/30)
      const correctCount = 26;
      const totalQ = javaAssessment.questions.length;
      const answersSummary = javaAssessment.questions.map((q, idx) => ({
        questionNumber: q.questionNumber,
        questionText: q.questionText,
        selectedOption: idx < correctCount ? q.correctAnswer : ((q.correctAnswer + 1) % 4),
        correctOption: q.correctAnswer,
        isCorrect: idx < correctCount,
        options: q.options,
        explanation: q.explanation,
      }));

      await Result.create({
        student: studentUser._id,
        itemType: 'assessment',
        assessment: javaAssessment._id,
        course: firstCourse._id,
        subject: firstCourse.category,
        title: javaAssessment.title,
        totalQuestions: totalQ,
        correctAnswers: correctCount,
        incorrectAnswers: totalQ - correctCount,
        score: correctCount,
        totalMarks: 30,
        percentage: Math.round((correctCount / totalQ) * 100),
        passed: true,
        answersSummary,
        timeSpentSeconds: 1420,
        submissionDate: new Date(Date.now() - 3600000 * 5),
      });

      // Update progress for first course to reflect completed assessment
      await Progress.findOneAndUpdate(
        { student: studentUser._id, course: firstCourse._id },
        { hasCompletedAssessment: true, $inc: { completionPercentage: 20 } }
      );
    }

    // 5. Seed Welcome Notifications for Student
    await Notification.create([
      {
        recipient: studentUser._id,
        title: 'Welcome to Ed Tech Portal!',
        message: 'Welcome to the Ed Tech Interactive Learning and Assessment Portal. Explore the 6 comprehensive courses, practice with interactive quizzes, and test your skills in the assessment modules.',
        type: 'announcement',
        link: '/courses',
        isRead: false,
      },
      {
        recipient: studentUser._id,
        title: 'Java Programming Assessment Evaluated',
        message: 'You scored 26/30 (87%) in the Java Programming Comprehensive Assessment. Excellent work! View your performance breakdown in My Results.',
        type: 'assessment',
        link: '/results',
        isRead: false,
      },
      {
        recipient: studentUser._id,
        title: 'New Speed Quiz Available',
        message: 'A 20-minute timed quiz for Web Development is now available. Challenge yourself under real time constraints!',
        type: 'quiz',
        link: '/quizzes',
        isRead: true,
      },
    ]);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed with error:', error);
    process.exit(1);
  }
};

seedDatabase();
