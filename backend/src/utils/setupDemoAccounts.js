const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '../../.env');
dotenv.config({ path: envPath });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const { normalizeEmail } = require('./adminEmail');

const createDemoAccount = async (name, role) => {
  const existingUser = await User.findOne({
    role,
    email: new RegExp(`^demo-${role}-[a-f0-9]+@example\\.test$`),
  }).sort({ createdAt: 1 });
  const suffix = crypto.randomBytes(4).toString('hex');
  const email = existingUser?.email || `demo-${role}-${suffix}@example.test`;
  const password = crypto.randomBytes(24).toString('base64url');
  const user = existingUser || new User({ name, email, role });
  user.name = name;
  user.password = password;
  user.emailVerified = true;
  user.status = 'active';
  if (role === 'instructor') user.instructorRequestStatus = 'approved';
  await user.save();

  return { role, email: user.email, password };
};

const saveDemoCredentials = (credentials) => {
  let contents = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const values = {
    DEMO_ADMIN_EMAIL: credentials.admin.email,
    DEMO_ADMIN_PASSWORD: credentials.admin.password,
    DEMO_STUDENT_EMAIL: credentials.student.email,
    DEMO_STUDENT_PASSWORD: credentials.student.password,
    DEMO_INSTRUCTOR_EMAIL: credentials.instructor.email,
    DEMO_INSTRUCTOR_PASSWORD: credentials.instructor.password,
  };

  for (const [key, value] of Object.entries(values)) {
    const line = new RegExp(`^\\s*${key}\\s*=.*$`, 'm');
    contents = line.test(contents)
      ? contents.replace(line, `${key}=${value}`)
      : `${contents}${contents && !contents.endsWith('\n') ? '\n' : ''}${key}=${value}\n`;
  }

  fs.writeFileSync(envPath, contents, 'utf8');
};

const configureAuthorizedAdminEmail = (email) => {
  const existingContents = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const existingLine = existingContents.match(/^\s*ADMIN_EMAIL\s*=\s*(.*?)\s*$/m);
  const fileEmail = existingLine ? existingLine[1].replace(/^["']|["']$/g, '') : '';
  const configuredEmail = normalizeEmail(process.env.ADMIN_EMAIL || fileEmail);

  if (configuredEmail && configuredEmail !== normalizeEmail(email)) {
    throw new Error('Configured ADMIN_EMAIL does not match the existing administrator; no accounts were changed.');
  }

  if (!configuredEmail) {
    const updatedContents = existingLine
      ? existingContents.replace(existingLine[0], `ADMIN_EMAIL=${email}`)
      : `${existingContents}${existingContents && !existingContents.endsWith('\n') ? '\n' : ''}ADMIN_EMAIL=${email}\n`;
    fs.writeFileSync(envPath, updatedContents, 'utf8');
  }
};

const setupDemoAccounts = async () => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Demo accounts can only be created outside production.');
  }
  if (process.env.DEMO_ADMIN_RESET_CONFIRM !== 'YES') {
    throw new Error('Set DEMO_ADMIN_RESET_CONFIRM=YES after confirming the existing admin password reset.');
  }

  await connectDB();

  const admin = await User.findOne({ role: 'admin' }).select('+password');
  if (!admin) {
    throw new Error('No existing administrator was found. Use the authorized administrator bootstrap process first.');
  }

  configureAuthorizedAdminEmail(admin.email);

  const credentials = [];
  const adminPassword = crypto.randomBytes(24).toString('base64url');
  admin.password = adminPassword;
  admin.status = 'active';
  await admin.save();
  const adminCredentials = { role: 'admin', email: admin.email, password: adminPassword };

  const student = await createDemoAccount('Demo Student', 'student');
  const instructor = await createDemoAccount('Demo Instructor', 'instructor');
  saveDemoCredentials({
    admin: adminCredentials,
    student,
    instructor,
  });

  console.log('Demo accounts are ready. Random credentials are saved in the ignored backend/.env file.');
  console.log('The local development login page can now autofill these credentials. Restart the backend.');
};

setupDemoAccounts()
  .catch((error) => {
    console.error(`Demo account setup failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
