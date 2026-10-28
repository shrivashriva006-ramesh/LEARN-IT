const http = require('http');
const crypto = require('crypto');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./src/models/User');
const port = Number(process.env.PORT || 5000);
const email = `learn-it-test-${Date.now()}@example.test`;
const verificationEmail = `learn-it-verify-${Date.now()}@example.test`;
const instructorEmail = `learn-it-instructor-${Date.now()}@example.test`;
const adminEmail = (process.env.TEST_ADMIN_EMAIL || `learn-it-admin-${Date.now()}@example.test`)
  .trim()
  .toLowerCase();
const configuredAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const canTestAuthorizedAdmin = Boolean(configuredAdminEmail) && configuredAdminEmail === adminEmail;
const unauthorizedAdminEmail = `learn-it-unauthorized-admin-${Date.now()}@example.test`;
const password = 'Integration-Test-Passphrase-742!';
let passed = 0;
let total = 0;

function request(method, route, body, cookie) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: `/api${route}`,
        method,
        headers: {
          ...(body ? {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
          } : {}),
          ...(cookie ? { Cookie: cookie } : {}),
        },
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => { responseBody += chunk; });
        res.on('end', () => {
          let parsedBody;
          try {
            parsedBody = JSON.parse(responseBody);
          } catch {
            parsedBody = {};
          }
          resolve({ status: res.statusCode, data: parsedBody, headers: res.headers });
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function assert(condition, description) {
  total += 1;
  if (condition) {
    passed += 1;
    console.log(`[PASS] ${description}`);
  } else {
    console.error(`[FAIL] ${description}`);
  }
}

async function runTests() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edtech_learning_portal');
    await User.init();

    const health = await request('GET', '/health');
    assert(health.status === 200 && health.data.status === 'success', 'API health check');

    const invalidEmail = await request('POST', '/auth/register', {
      name: 'Integration Test',
      email: 'not-an-email',
      password,
      confirmPassword: password,
    });
    assert(invalidEmail.status === 400, 'Reject invalid email registration');

    const elevatedRegistration = await request('POST', '/auth/register', {
      name: 'Integration Test',
      email,
      password,
      confirmPassword: password,
      role: 'admin',
    });
    assert(
      elevatedRegistration.status === (configuredAdminEmail ? 403 : 503),
      'Reject elevated role in public registration'
    );

    const instructorRequest = await request('POST', '/auth/register', {
      name: 'Integration Instructor Request',
      email: instructorEmail,
      password,
      confirmPassword: password,
      role: 'instructor',
    });
    const pendingInstructor = await User.findOne({ email: instructorEmail });
    assert(
      instructorRequest.status === 201 &&
      pendingInstructor?.role === 'student' &&
      pendingInstructor?.instructorRequestStatus === 'pending',
      'Instructor registration creates a student account with a pending request'
    );

    const adminRegistration = await request('POST', '/auth/register', {
      name: 'Unauthorized Admin Request',
      email: unauthorizedAdminEmail,
      password,
      confirmPassword: password,
      role: 'admin',
    });
    assert(
      adminRegistration.status === (configuredAdminEmail ? 403 : 503) &&
      (!configuredAdminEmail ||
        adminRegistration.data.message === 'Administrator registration is restricted to the authorized email address.'),
      'Reject administrator registration from an unauthorized or unconfigured email'
    );

    const registration = await request('POST', '/auth/register', {
      name: 'Integration Test Student',
      email,
      password,
      confirmPassword: password,
    });
    assert(registration.status === 201, 'Register a new student account');
    assert(!registration.headers['set-cookie'], 'Registration does not automatically create a login session');

    const duplicateRegistration = await request('POST', '/auth/register', {
      name: 'Integration Test Student',
      email,
      password,
      confirmPassword: password,
    });
    assert(duplicateRegistration.status === 409, 'Reject duplicate email registration');

    const pendingInstructorLogin = await request('POST', '/auth/login', {
      email: instructorEmail,
      password,
    });
    assert(
      pendingInstructorLogin.status === 200 &&
      pendingInstructorLogin.data.user.role === 'student',
      'Pending instructor request does not grant instructor login role'
    );

    const studentSelectingInstructor = await request('POST', '/auth/login', {
      email,
      password,
    });
    const studentCookie = studentSelectingInstructor.headers['set-cookie']
      ?.find((value) => value.startsWith('edtech_token='))
      ?.split(';')[0];
    assert(studentSelectingInstructor.status === 200 && studentSelectingInstructor.data.user.role === 'student', 'Authenticate students from their stored database role');

    const unauthenticatedAdminAccess = await request('GET', '/admin/stats');
    assert(unauthenticatedAdminAccess.status === 401, 'Reject unauthenticated administrator API requests');

    if (canTestAuthorizedAdmin) {
      if (!process.env.SMTP_HOST) {
        const authorizedAdminRegistration = await request('POST', '/auth/register', {
          name: 'Integration Administrator Request',
          email: adminEmail,
          password,
          confirmPassword: password,
          role: 'admin',
        });
        assert(
          authorizedAdminRegistration.status === 503 &&
          !(await User.exists({ email: adminEmail })),
          'Require configured email verification before authorized administrator setup'
        );
      }

      await User.create({
        name: 'Unauthorized Integration Administrator',
        email: unauthorizedAdminEmail,
        password,
        role: 'admin',
      });
      const unauthorizedAdminLogin = await request('POST', '/auth/login', {
        email: unauthorizedAdminEmail,
        password,
      });
      assert(
        unauthorizedAdminLogin.status === 403,
        'Reject administrator login for an email outside ADMIN_EMAIL'
      );
      await User.deleteOne({ email: unauthorizedAdminEmail });

      await User.create({
        name: 'Integration Administrator',
        email: adminEmail,
        password,
        role: 'admin',
      });
      const adminLogin = await request('POST', '/auth/login', {
        email: adminEmail,
        password,
      });
      const adminCookie = adminLogin.headers['set-cookie']
        ?.find((value) => value.startsWith('edtech_token='))
        ?.split(';')[0];
      assert(
        adminLogin.status === 200 && adminLogin.data.user.role === 'admin',
        'Allow the configured administrator to sign in'
      );
      const adminDashboardApi = await request('GET', '/admin/stats', undefined, adminCookie);
      assert(adminDashboardApi.status === 200, 'Allow the configured administrator to access administrator APIs');
      assert(
        (await request('PATCH', `/admin/users/${(await User.findOne({ email }))._id}/role`, { role: 'admin' }, adminCookie)).status === 403,
        'Prevent administrator role assignment through the user-management API'
      );

      let duplicateAdminRejected = false;
      try {
        await User.create({
          name: 'Duplicate Integration Administrator',
          email: `learn-it-second-admin-${Date.now()}@example.test`,
          password,
          role: 'admin',
        });
      } catch (error) {
        duplicateAdminRejected = error.code === 11000;
      }
      assert(duplicateAdminRejected, 'Enforce a single administrator account in MongoDB');

      const pendingRequests = await request('GET', '/admin/instructor-requests', undefined, adminCookie);
      const requestId = pendingRequests.data.requests?.find((entry) => entry.email === instructorEmail)?._id;
      const approveRequest = requestId
        ? await request('PATCH', `/admin/instructor-requests/${requestId}`, { decision: 'approve' }, adminCookie)
        : { status: 404 };
      const instructorLogin = await request('POST', '/auth/login', {
        email: instructorEmail,
        password,
      });
      const instructorCookie = instructorLogin.headers['set-cookie']
        ?.find((value) => value.startsWith('edtech_token='))
        ?.split(';')[0];
      assert(
        pendingRequests.status === 200 && approveRequest.status === 200 &&
        instructorLogin.status === 200 && instructorLogin.data.user.role === 'instructor',
        'Administrator approval grants instructor role'
      );
      const instructorDashboardApi = await request('GET', '/instructor/stats', undefined, instructorCookie);
      assert(instructorDashboardApi.status === 200, 'Allow approved instructors to access instructor APIs');
    } else {
      const pendingInstructorAccess = await request('GET', '/instructor/stats', undefined, studentCookie);
      assert(pendingInstructorAccess.status === 403, 'Pending instructor requests do not grant instructor API access');
    }

    const incorrectLogin = await request('POST', '/auth/login', {
      email,
      password: 'Incorrect-Password-742!',
    });
    assert(incorrectLogin.status === 401, 'Reject incorrect login credentials');

    const login = await request('POST', '/auth/login', {
      email,
      password,
    });
    const setCookie = login.headers['set-cookie']?.find((value) => value.startsWith('edtech_token='));
    const cookie = setCookie?.split(';')[0];
    assert(login.status === 200 && Boolean(cookie), 'Log in with the registered credentials');
    assert(setCookie?.includes('HttpOnly') && setCookie?.includes('SameSite=Strict'), 'Store JWT in an HTTP-only, same-site cookie');

    const currentUser = await request('GET', '/auth/me', undefined, cookie);
    assert(currentUser.status === 200 && currentUser.data.user.role === 'student', 'Load the authenticated student session');
    const alteredFrontendRole = await request('GET', '/admin/stats', undefined, studentCookie);
    assert(alteredFrontendRole.status === 403, 'Ignore frontend role tampering and enforce the MongoDB role');

    const storedUser = await User.findOne({ email }).select('+password');
    assert(
      Boolean(storedUser) &&
      storedUser.password !== password &&
      await bcrypt.compare(password, storedUser.password),
      'Persist only a bcrypt-hashed password'
    );

    const adminAccess = await request('GET', '/admin/stats', undefined, cookie);
    const instructorAccess = await request('GET', '/instructor/stats', undefined, cookie);
    assert(adminAccess.status === 403, 'Deny student access to administrator routes');
    assert(instructorAccess.status === 403, 'Deny student access to instructor routes');

    const courses = await request('GET', '/courses', undefined, cookie);
    const assessments = await request('GET', '/assessments', undefined, cookie);
    const quizzes = await request('GET', '/quizzes', undefined, cookie);
    const progress = await request('GET', '/progress/my-progress', undefined, cookie);
    assert(courses.status === 200, 'Existing course catalog endpoint responds');
    assert(assessments.status === 200, 'Existing assessments endpoint responds');
    assert(quizzes.status === 200, 'Existing quizzes endpoint responds');
    assert(progress.status === 200, 'Existing student progress endpoint responds');

    const verificationToken = crypto.randomBytes(32).toString('hex');
    await User.create({
      name: 'Pending Verification Student',
      email: verificationEmail,
      password,
      role: 'student',
      emailVerified: false,
      emailVerificationTokenHash: crypto.createHash('sha256').update(verificationToken).digest('hex'),
      emailVerificationExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });
    const unverifiedLogin = await request('POST', '/auth/login', {
      email: verificationEmail,
      password,
    });
    assert(unverifiedLogin.status === 403, 'Require email verification before login when enabled');
    const verified = await request('POST', '/auth/verify-email', { token: verificationToken });
    assert(verified.status === 200, 'Verify an account with its valid expiring token');
    const verifiedLogin = await request('POST', '/auth/login', {
      email: verificationEmail,
      password,
    });
    assert(verifiedLogin.status === 200, 'Allow login after email verification');

    const logout = await request('POST', '/auth/logout', undefined, cookie);
    const sessionAfterLogout = await request('GET', '/auth/me');
    const clearedCookie = logout.headers['set-cookie']?.some((value) =>
      value.startsWith('edtech_token=') &&
      (value.includes('Max-Age=0') || value.includes('Expires=Thu, 01 Jan 1970'))
    );
    assert(logout.status === 200 && clearedCookie, 'Logout clears the authentication cookie');
    assert(sessionAfterLogout.status === 401, 'Unauthenticated requests are rejected after logout');
  } finally {
    await User.deleteMany({
      email: {
        $in: [
          email,
          verificationEmail,
          instructorEmail,
          adminEmail,
          unauthorizedAdminEmail,
        ],
      },
    });
    await mongoose.disconnect();
  }
}

runTests()
  .then(() => {
    console.log(`\nResults: ${passed}/${total} checks passed.`);
    if (passed !== total) process.exitCode = 1;
  })
  .catch((error) => {
    console.error(`Integration checks could not complete: ${error.message}`);
    process.exitCode = 1;
  });
