/**
 * CREATE OR UPGRADE ADMIN ACCOUNT
 * 
 * Usage:
 *   node createAdmin.js [email] [password] [name]
 * 
 * Examples:
 *   node createAdmin.js
 *   node createAdmin.js admin@rootly.local SecureAdminPass123! "Rootly Admin"
 */

import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from './config/db.js';
import { User } from './models/User.js';

const run = async () => {
  const email = (process.argv[2] || 'admin@rootly.local').trim().toLowerCase();
  const password = process.argv[3] || 'RootlyAdmin2026!';
  const name = process.argv[4] || 'Central Agronomy Administrator';

  if (password.length < 8) {
    console.error('❌ Error: Password must be at least 8 characters long.');
    process.exit(1);
  }

  try {
    await connectDB();
    console.log('Connected to MongoDB database.');

    let user = await User.findOne({ email });

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    if (user) {
      user.role = 'ADMIN';
      user.accountStatus = 'ACTIVE';
      user.passwordHash = passwordHash;
      if (name) user.name = name;
      await user.save();
      console.log(`\n✅ Existing user "${email}" upgraded to ADMIN!`);
    } else {
      user = await User.create({
        name,
        email,
        passwordHash,
        role: 'ADMIN',
        accountStatus: 'ACTIVE',
        preferredLanguage: 'en',
        profile: {
          gardenName: 'Central Agronomy Node'
        }
      });
      console.log(`\n✅ New ADMIN account created for "${email}"!`);
    }

    console.log('----------------------------------------------------');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     ADMIN`);
    console.log('----------------------------------------------------');
    console.log('You can now log in at http://localhost:5174/login and visit /admin\n');

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin user:', err.message);
    process.exit(1);
  }
};

run();
