const Assessment = require('../models/Assessment');
const Result = require('../models/Result');
const Progress = require('../models/Progress');
const Notification = require('../models/Notification');
const Course = require('../models/Course');

// @desc    Get all assessments
// @route   GET /api/assessments
// @access  Public / Private
exports.getAssessments = async (req, res, next) => {
  try {
    const { subject, courseId } = req.query;
    let query = {};

    if (subject && subject !== 'All') {
      query.subject = new RegExp(`^${subject}$`, 'i');
    }
    if (courseId) {
      query.course = courseId;
    }

    const assessments = await Assessment.find(query)
      .populate('course', 'title category thumbnail')
      .populate('createdBy', 'name email')
      .select('-questions.correctAnswer -questions.explanation');

    res.status(200).json({
      success: true,
      count: assessments.length,
      assessments: assessments.map(a => ({
        _id: a._id,
        title: a.title,
        subject: a.subject,
        description: a.description,
        totalMarks: a.totalMarks,
        passingPercentage: a.passingPercentage,
        questionCount: a.questions ? a.questions.length : 0,
        course: a.course,
        createdBy: a.createdBy,
        createdAt: a.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get assessment by ID (sanitized for students)
// @route   GET /api/assessments/:id
// @access  Private
exports.getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('course', 'title category thumbnail')
      .populate('createdBy', 'name email');

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Role check: Only instructor or admin can view correct answers directly in GET
    const isPrivileged = req.user && (req.user.role === 'admin' || req.user.role === 'instructor');

    const sanitizedQuestions = assessment.questions.map((q) => {
      const base = {
        questionNumber: q.questionNumber,
        questionText: q.questionText,
        codeSnippet: q.codeSnippet,
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
      assessment: {
        _id: assessment._id,
        title: assessment.title,
        subject: assessment.subject,
        description: assessment.description,
        totalMarks: assessment.totalMarks,
        passingPercentage: assessment.passingPercentage,
        course: assessment.course,
        questions: sanitizedQuestions,
        totalQuestions: sanitizedQuestions.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit assessment attempt
// @route   POST /api/assessments/:id/submit
// @access  Private (Student)
exports.submitAssessment = async (req, res, next) => {
  try {
    const { answers, timeSpentSeconds } = req.body; // answers is { [questionNumber]: selectedOptionIndex }
    const studentId = req.user.id;

    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    let correctAnswersCount = 0;
    const answersSummary = [];

    // Evaluate each question on the backend
    assessment.questions.forEach((q) => {
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

    const totalQuestions = assessment.questions.length;
    const totalMarks = assessment.totalMarks || totalQuestions;
    // Scale score to totalMarks
    const score = Math.round((correctAnswersCount / totalQuestions) * totalMarks);
    const percentage = Math.round((correctAnswersCount / totalQuestions) * 100);
    const passed = percentage >= (assessment.passingPercentage || 50);

    const result = await Result.create({
      student: studentId,
      itemType: 'assessment',
      assessment: assessment._id,
      course: assessment.course,
      subject: assessment.subject,
      title: assessment.title,
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

    // Update student progress
    if (assessment.course) {
      const progress = await Progress.findOne({ student: studentId, course: assessment.course });
      if (progress) {
        progress.hasCompletedAssessment = true;
        progress.lastActivityAt = new Date();
        // Recalculate progress:
        // lessons weight: 60%, assessment weight: 20%, quiz weight: 20%
        const lessonWeight = progress.totalLessons > 0 ? (progress.completedLessons.length / progress.totalLessons) * 60 : 60;
        const assessWeight = 20; // completed!
        const quizWeight = progress.hasCompletedQuiz ? 20 : 0;
        progress.completionPercentage = Math.min(100, Math.round(lessonWeight + assessWeight + quizWeight));
        await progress.save();
      }
    }

    // Create notification
    await Notification.create({
      recipient: studentId,
      title: `Assessment Completed: ${assessment.title}`,
      message: `You scored ${score}/${totalMarks} (${percentage}%) in ${assessment.subject} Assessment. ${passed ? 'Great job, you passed!' : 'Review the solutions and try again to improve.'}`,
      type: 'assessment',
      link: `/results`,
    });

    res.status(201).json({
      success: true,
      message: 'Assessment submitted and evaluated successfully',
      result,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new assessment
// @route   POST /api/assessments
// @access  Private (Instructor, Admin)
exports.createAssessment = async (req, res, next) => {
  try {
    const { course, title, subject, description, questions, totalMarks, passingPercentage } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide valid questions' });
    }

    const assessment = await Assessment.create({
      course,
      title,
      subject,
      description: description || '',
      questions,
      totalMarks: totalMarks || questions.length,
      passingPercentage: passingPercentage || 50,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Assessment created successfully',
      assessment,
    });
  } catch (err) {
    next(err);
  }
};
