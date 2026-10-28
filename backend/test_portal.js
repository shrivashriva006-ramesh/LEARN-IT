const http = require('http');

function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('========================================================');
  console.log(' ED TECH PORTAL - FULL-STACK INTEGRATION TEST SUITE');
  console.log('========================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
    }
  }

  // 1. Health check
  const health = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET',
  });
  assert(health.status === 200 && health.data.status === 'success', 'API Health Check');

  // 2. Student Login
  const studentLogin = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'student@edtech.com', password: 'Student@123' }
  );
  assert(studentLogin.status === 200 && studentLogin.data.token, 'Student Authentication');
  const studentToken = studentLogin.data.token;

  // 3. Instructor Login
  const instLogin = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'instructor@edtech.com', password: 'Instructor@123' }
  );
  assert(instLogin.status === 200 && instLogin.data.user.role === 'instructor', 'Instructor Authentication');
  const instToken = instLogin.data.token;

  // 4. Admin Login
  const adminLogin = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@edtech.com', password: 'Admin@123' }
  );
  assert(adminLogin.status === 200 && adminLogin.data.user.role === 'admin', 'Admin Authentication');
  const adminToken = adminLogin.data.token;

  // 5. Fetch Courses
  const coursesRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/courses',
    method: 'GET',
  });
  assert(
    coursesRes.status === 200 && coursesRes.data.courses.length === 6,
    'Retrieve exactly 6 technical courses'
  );

  const courseList = coursesRes.data.courses;
  const courseNames = courseList.map((c) => c.title);
  assert(
    courseNames.includes('Java Programming') &&
      courseNames.includes('Web Development') &&
      courseNames.includes('Database Management') &&
      courseNames.includes('Cyber Security') &&
      courseNames.includes('Cloud Computing') &&
      courseNames.includes('Python Programming'),
    'All 6 exact required subjects present'
  );

  // 6. Fetch Assessments
  const assessRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/assessments',
    method: 'GET',
  });
  assert(
    assessRes.status === 200 && assessRes.data.assessments.length === 6,
    'Retrieve exactly 6 subject assessments'
  );

  // 7. Test single assessment questions count and answer security
  const firstAssessmentId = assessRes.data.assessments[0]._id;
  const singleAssessRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/assessments/${firstAssessmentId}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(
    singleAssessRes.status === 200 &&
      singleAssessRes.data.assessment.questions.length === 30,
    'Assessment contains exactly 30 questions (Subject 1)'
  );

  // Verify answer security: correctAnswer is not exposed to student
  const hasExposedAnswer = singleAssessRes.data.assessment.questions.some(
    (q) => q.correctAnswer !== undefined
  );
  assert(!hasExposedAnswer, 'Security check: Correct answers are NOT exposed in public student API');

  // Verify all 6 assessments have exactly 30 questions
  let all30Assess = true;
  for (const a of assessRes.data.assessments) {
    const r = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/assessments/${a._id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    if (r.data.assessment.questions.length !== 30) {
      all30Assess = false;
    }
  }
  assert(all30Assess, 'VERIFIED: All 6 subjects contain EXACTLY 30 assessment questions (180 Total)');

  // 8. Fetch Quizzes
  const quizzesRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/quizzes',
    method: 'GET',
  });
  assert(
    quizzesRes.status === 200 && quizzesRes.data.quizzes.length === 6,
    'Retrieve exactly 6 speed quizzes'
  );

  // Verify all 6 quizzes have exactly 20 questions
  let all20Quiz = true;
  for (const q of quizzesRes.data.quizzes) {
    const r = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/quizzes/${q._id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    if (r.data.quiz.questions.length !== 20) {
      all20Quiz = false;
    }
  }
  assert(all20Quiz, 'VERIFIED: All 6 subjects contain EXACTLY 20 quiz questions (120 Total)');

  // 9. Submit Assessment Attempt
  const submitAssessRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/assessments/${firstAssessmentId}/submit`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
    },
    {
      answers: { 1: 1, 2: 2, 3: 1, 4: 1, 5: 2 },
      timeSpentSeconds: 320,
    }
  );
  assert(
    submitAssessRes.status === 201 &&
      submitAssessRes.data.result.score !== undefined &&
      submitAssessRes.data.result.answersSummary.length === 30,
    'Server-side assessment evaluation & solution breakdown'
  );

  // 10. Submit Quiz Attempt
  const firstQuizId = quizzesRes.data.quizzes[0]._id;
  const submitQuizRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/quizzes/${firstQuizId}/submit`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
    },
    {
      answers: { 1: 1, 2: 1, 3: 2 },
      timeSpentSeconds: 150,
      timedOut: false,
    }
  );
  assert(
    submitQuizRes.status === 201 && submitQuizRes.data.result.score !== undefined,
    'Server-side quiz evaluation & scoring'
  );

  // 11. Fetch Results
  const resultsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/results/my-results',
    method: 'GET',
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(
    resultsRes.status === 200 && resultsRes.data.results.length >= 2,
    'My Results history returns persistent student records'
  );

  // 12. Fetch Dynamic Progress
  const progressRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/progress/my-progress',
    method: 'GET',
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(
    progressRes.status === 200 &&
      progressRes.data.overallPercentage >= 0 &&
      progressRes.data.progressList.length === 6,
    'Dynamic course-wise progress and analytics calculated from database'
  );

  // 13. Test Lesson Progress Toggle
  const firstCourseLessons = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/lessons?courseId=${courseList[0]._id}`,
    method: 'GET',
  });
  const firstLessonId = firstCourseLessons.data.lessons[0]._id;
  const toggleLesson = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/progress/${firstLessonId}`,
    method: 'PATCH',
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(
    toggleLesson.status === 200 && toggleLesson.data.completionPercentage !== undefined,
    'Lesson completion toggle updates real-time progress percentage'
  );

  // 14. Instructor Dashboard Stats
  const instructorStats = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/instructor/stats',
    method: 'GET',
    headers: { Authorization: `Bearer ${instToken}` },
  });
  assert(
    instructorStats.status === 200 && instructorStats.data.stats.totalCourses >= 1,
    'Instructor Dashboard metrics endpoint'
  );

  // 15. Admin Dashboard Stats & User Management
  const adminStats = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/stats',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(
    adminStats.status === 200 && adminStats.data.stats.totalStudents >= 1,
    'Admin Dashboard platform metrics endpoint'
  );

  const adminUsers = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/users',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(
    adminUsers.status === 200 && adminUsers.data.users.length >= 3,
    'Admin User Management returns registered accounts'
  );

  // 16. Notifications
  const notifRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/notifications',
    method: 'GET',
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(
    notifRes.status === 200 && notifRes.data.notifications.length >= 1,
    'Notifications retrieval with unread tracking'
  );

  console.log('\n========================================================');
  console.log(` RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log('========================================================');
}

runTests();
