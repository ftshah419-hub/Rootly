import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db.js';
import * as authService from '../services/authService.js';
import { User } from '../models/User.js';
import { RefreshSession } from '../models/RefreshSession.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { getProducts } from '../services/productService.js';

const runTests = async () => {
  console.log('--- STARTING ROOTLY AUTH & BACKEND TEST SUITE ---');

  try {
    await connectDB();
    console.log('✅ 1. Database Connection Passed');

    const testEmail = `test_neighbor_${Date.now()}@rootly.local`;
    const testPassword = 'SecureRootlyPassword2026!';

    // Test 1: User Registration
    const regResult = await authService.registerUser({
      name: 'Maya Krishnan',
      email: testEmail,
      password: testPassword,
      phone: '+919847012345',
      preferredLanguage: 'en',
      interests: ['Home Gardener', 'Heirloom Veggies']
    });

    if (!regResult.accessToken || !regResult.refreshToken || !regResult.user) {
      throw new Error('Registration failed to return tokens and safe user');
    }
    if (regResult.user.role !== 'USER') {
      throw new Error('Registration failed to enforce default USER role');
    }
    if (regResult.user.passwordHash) {
      throw new Error('Security violation: passwordHash exposed in safe user');
    }
    console.log('✅ 2. User Registration Passed (Role is USER, password hashed, tokens issued)');

    // Test 2: Duplicate Email Handling
    let duplicateRejected = false;
    try {
      await authService.registerUser({
        name: 'Imposter',
        email: testEmail,
        password: 'AnotherPassword123'
      });
    } catch (err) {
      if (err.statusCode === 409) duplicateRejected = true;
    }
    if (!duplicateRejected) {
      throw new Error('Duplicate email was not rejected with 409');
    }
    console.log('✅ 3. Duplicate Email Prevention Passed (409 Conflict returned)');

    // Test 3: Login with Correct Credentials
    const loginResult = await authService.loginUser({
      email: testEmail,
      password: testPassword
    });
    if (!loginResult.accessToken || !loginResult.refreshToken) {
      throw new Error('Login failed to return tokens');
    }
    console.log('✅ 4. Valid Login Passed');

    // Test 4: Login with Invalid Password
    let invalidPassRejected = false;
    try {
      await authService.loginUser({
        email: testEmail,
        password: 'WrongPassword!'
      });
    } catch (err) {
      if (err.statusCode === 401) invalidPassRejected = true;
    }
    if (!invalidPassRejected) {
      throw new Error('Invalid password was not rejected with 401');
    }
    console.log('✅ 5. Invalid Password Rejected Passed (401 Unauthorized)');

    // Test 5: Token Refresh & Rotation
    const oldRefreshToken = loginResult.refreshToken;
    const refreshResult = await authService.refreshSession(oldRefreshToken);
    if (!refreshResult.accessToken || !refreshResult.refreshToken) {
      throw new Error('Refresh failed to return rotated tokens');
    }
    if (refreshResult.refreshToken === oldRefreshToken) {
      throw new Error('Refresh token rotation failed: same token returned');
    }

    // Verify old refresh token is now revoked
    let oldTokenRejected = false;
    try {
      await authService.refreshSession(oldRefreshToken);
    } catch (err) {
      if (err.statusCode === 401) oldTokenRejected = true;
    }
    if (!oldTokenRejected) {
      throw new Error('Revoked refresh token was still accepted');
    }
    console.log('✅ 6. Refresh Token Rotation Passed (Old session invalidated, new token issued)');

    // Test 6: Forgot & Reset Password
    const forgotResult = await authService.forgotPassword(testEmail);
    if (!forgotResult.devToken) {
      throw new Error('Forgot password failed to generate reset token');
    }
    const newPassword = 'NewFreshPassword2026!';
    const resetResult = await authService.resetPassword(forgotResult.devToken, newPassword);
    console.log('✅ 7. Password Reset Token Generation & Execution Passed');

    // Test 7: Login with New Password
    const newLoginResult = await authService.loginUser({
      email: testEmail,
      password: newPassword
    });
    if (!newLoginResult.accessToken) {
      throw new Error('Login with updated password failed');
    }
    console.log('✅ 8. Login with New Password Passed');

    // Test 8: Logout
    await authService.logoutUser(newLoginResult.refreshToken);
    let loggedOutRejected = false;
    try {
      await authService.refreshSession(newLoginResult.refreshToken);
    } catch (err) {
      if (err.statusCode === 401) loggedOutRejected = true;
    }
    if (!loggedOutRejected) {
      throw new Error('Logged out session was still active');
    }
    console.log('✅ 9. Logout & Session Invalidation Passed');

    // Test 9: Category & Product Geospatial Query
    let testCategory = await Category.findOne({ slug: 'organic-veggies' });
    if (!testCategory) {
      testCategory = await Category.create({
        name: 'Organic Vegetables',
        slug: 'organic-veggies',
        description: 'Fresh vegetables grown in home gardens'
      });
    }

    const testProduct = await Product.create({
      sellerId: regResult.user._id,
      categoryId: testCategory._id,
      name: 'Country Spinach & Amaranth',
      description: 'Cheera leaves freshly harvested from our garden in Aluva.',
      exchangeType: 'BARTER',
      pricing: { price: 0, unit: 'bunch' },
      quantity: { available: 5, unit: 'bunch' },
      location: {
        type: 'Point',
        coordinates: [76.35, 10.11], // [longitude, latitude]
        neighborhood: 'Aluva Riverbank',
        city: 'Kochi'
      },
      availabilityStatus: 'AVAILABLE'
    });

    const nearbyResults = await getProducts({
      longitude: 76.35,
      latitude: 10.11,
      radiusKm: 5
    });

    if (nearbyResults.products.length === 0) {
      throw new Error('Geospatial product query returned zero results');
    }
    console.log(`✅ 10. Geospatial 2dsphere Query Passed (Found ${nearbyResults.products.length} products within radius)`);

    // Cleanup test records
    await Product.deleteOne({ _id: testProduct._id });
    await User.deleteOne({ email: testEmail });
    await RefreshSession.deleteMany({ userId: regResult.user._id });
    await PasswordResetToken.deleteMany({ userId: regResult.user._id });
    console.log('🧹 Test artifacts cleaned up successfully.');

    console.log('\n🎉 ALL 10 AUTHENTICATION & BACKEND CORE TESTS PASSED WITH 100% SUCCESS!');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST FAILURE:', error);
    await disconnectDB();
    process.exit(1);
  }
};

runTests();
