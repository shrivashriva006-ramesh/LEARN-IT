const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const { getConfiguredAdminEmail } = require('./adminEmail');

const bootstrapAdmin = async () => {
  try {
    const email = getConfiguredAdminEmail();
    if (!email) {
      throw new Error('Set ADMIN_EMAIL to the single authorized administrator email in backend/.env.');
    }

    await connectDB();

    if (await User.exists({ role: 'admin' })) {
      throw new Error('An administrator already exists; bootstrap is only available before the first administrator.');
    }

    const user = await User.findOne({
      email,
      role: 'student',
      status: 'active',
      emailVerified: true,
      adminRegistrationRequested: true,
    });
    if (!user) {
      throw new Error('No active, email-verified administrator registration matches ADMIN_EMAIL.');
    }

    user.role = 'admin';
    await user.save();
    console.log('Initial administrator role assigned. Sign in with the account’s existing credentials.');
  } catch (error) {
    console.error(`Administrator bootstrap failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    const mongoose = require('mongoose');
    await mongoose.disconnect();
  }
};

bootstrapAdmin();
