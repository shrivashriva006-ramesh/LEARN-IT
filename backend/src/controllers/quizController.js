const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const Progress = require('../models/Progress');
const Notification = require('../models/Notification');

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Public / Private
exports.getQuizzes = async (req, res, next) => {
  try {
    const { subject, courseId } = req.query;
    let query = {};

    if (subject && subject !== 'All') {
      query.subject = new RegExp(`^${subject}$`, 'i');
    }
    if (courseId) {
      query.course = courseId;
    }

    const quizzes = await Quiz.find(query)
      .populate('course', 'title category thumbnail')
      .populate('createdBy', 'name email')
      .select('-questions.correctAnswer -questions.explanation');

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes: quizzes.map(q => ({
        _id: q._id,
        title: q.title,
        subject: q.subject,
        durationMinutes: q.durationMinutes,
        totalMarks: q.totalMarks,
        questionCount: q.questions ? q.questions.length : 0,
        course: q.course,
        createdBy: q.createdBy,
        createdAt: q.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single quiz by ID (sanitized)
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('course', 'title category thumbnail')
      .populate('createdBy', 'name email');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const isPrivileged = req.user && (req.user.role === 'admin' || req.user.role === 'instructor');

    const sanitizedQuestions = quiz.questions.map((q) => {
      const base = {
        questionNumber: q.questionNumber,
        questionText: q.questionText,
        options: q.options,
      };
      if (isPrivileged) {
        base.correctAnswer = q.correctAnswer;
        base.explanation = q.explanation;
      }
      return base;
    });

    res.status(200).json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        subject: quiz.subject,
        durationMinutes: quiz.durationMinutes,
        totalMarks: quiz.totalMarks,
        course: quiz.course,
        questions: sanitizedQuestions,
        totalQuestions: sanitizedQuestions.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:id/submit
// @access  Private (Student)
exports.submitQuiz = async (req, res, next) => {
  try {
    const { answers, timeSpentSeconds, timedOut } = req.body;
    const studentId = req.user.id;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    let correctAnswersCount = 0;
    const answersSummary = [];

    quiz.questions.forEach((q) => {
      const selected = answers ? answers[q.questionNumber] : undefined;
      const isSelected = selected !== undefined && selected !== null && selected !== -1;
      const isCorrect = isSelected && Number(selected) === q.correctAnswer;

      if (isCorrect) {
        correctAnswersCount++;
      }

      answersSummary.push({
        questionNumber: q.questionNumber,
        questionText: q.questionText,
        selectedOption: isSelected ? Number(selected) : null,
        correctOption: q.correctAnswer,
        isCorrect: Boolean(isCorrect),
        options: q.options,
        explanation: q.explanation || '',
      });
    });

    const totalQuestions = quiz.questions.length;
    const totalMarks = quiz.totalMarks || totalQuestions;
    const score = Math.round((correctAnswersCount / totalQuestions) * totalMarks);
    const percentage = Math.round((correctAnswersCount / totalQuestions) * 100);
    const passed = percentage >= 50;

    const result = await Result.create({
      student: studentId,
      itemType: 'quiz',
      quiz: quiz._id,
      course: quiz.course,
      subject: quiz.subject,
      title: quiz.title,
      totalQuestions,
      correctAnswers: correctAnswersCount,
      incorrectAnswers: totalQuestions - correctAnswersCount,
      score,
      totalMarks,
      percentage,
      passed,
      answersSummary,
      timeSpentSeconds: timeSpentSeconds || 0,
      submissionDate: new Date(),
    });

    // Update progress
    if (quiz.course) {
      const progress = await Progress.findOne({ student: studentId, course: quiz.course });
      if (progress) {
        progress.hasCompletedQuiz = true;
        progress.lastActivityAt = new Date();
        const lessonWeight = progress.totalLessons > 0 ? (progress.completedLessons.length / progress.totalLessons) * 60 : 60;
        const assessWeight = progress.hasCompletedAssessment ? 20 : 0;
        const quizWeight = 20; // completed!
        progress.completionPercentage = Math.min(100, Math.round(lessonWeight + assessWeight + quizWeight));
        await progress.save();
      }
    }

    // Create notification
    await Notification.create({
      recipient: studentId,
      title: `Quiz Completed: ${quiz.title}`,
      message: `${timedOut ? 'Time expired! ' : ''}You scored ${score}/${totalMarks} (${percentage}%) in ${quiz.subject} Quiz. Check your detailed answers in My Results.`,
      type: 'quiz',
      link: `/results`,
    });

    res.status(201).json({
      success: true,
      message: 'Quiz evaluated and submitted successfully',
      result,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private (Instructor, Admin)
exports.createQuiz = async (req, res, next) => {
  try {
    const { course, title, subject, durationMinutes, totalMarks, questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide valid questions' });
    }

    const quiz = await Quiz.create({
      course,
      title,
      subject,
      durationMinutes: durationMinutes || 20,
      totalMarks: totalMarks || questions.length,
      questions,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quiz,
    });
  } catch (err) {
    next(err);
  }
};
