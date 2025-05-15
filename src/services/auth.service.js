const bcrypt = require('bcryptjs');
const { abortIf } = require('../utils/responder');
const httpStatus = require('http-status');
const userRepository = require('../repo/user.repo');
const jwt = require('jsonwebtoken');
const Authorization = require('../utils/authorization.service');
const crypto = require('crypto');

class AuthService {
  static signup = async ({ email, password, firstname, lastname, phone, address, tin }) => {
    const existingUser = await userRepository.findByEmail(email);
    abortIf(existingUser, httpStatus.BAD_REQUEST, 'User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpiry = new Date(Date.now() + 24 * 3600000); // 24 hours

    const user = await userRepository.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      phone,
      address,
      tin,
      balance: 0,
      emailVerificationToken,
      emailVerificationExpiry
    });

    // TODO: Send verification email with token
    const token = Authorization.generateToken({
      id: user._id,
      email: user.email,
    });

    const response = { user, token };
    
    // Only include verification token in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      response.emailVerificationToken = emailVerificationToken;
    }

    return response;
  };

  static signIn = async (email, password) => {
    const user = await userRepository.findByEmail(email);
    abortIf(!user, httpStatus.NOT_FOUND, 'User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    abortIf(!isMatch, httpStatus.BAD_REQUEST, 'Invalid credentials');

    abortIf(!user.isEmailVerified, httpStatus.FORBIDDEN, 'Please verify your email first');

    const token = Authorization.generateToken({
      id: user._id,
      email: user.email,
    });

    return { user, token };
  };

  static verifyEmail = async (token) => {
    const user = await userRepository.findOne({
      query: {
        emailVerificationToken: token,
        emailVerificationExpiry: { $gt: Date.now() }
      }
    });

    abortIf(!user, httpStatus.BAD_REQUEST, 'Invalid or expired verification token');

    await userRepository.update(user._id, {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiry: null
    });

    const response = { message: 'Email verified successfully' };
    
    // Only include verification token in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      response.verificationToken = token;
    }

    return response;
  };

  static verifyTin = async (userId, status, note = null) => {
    const user = await userRepository.findById(userId);
    abortIf(!user, httpStatus.NOT_FOUND, 'User not found');

    const updates = {
      tinVerificationStatus: status,
      tinVerificationDate: new Date(),
      tinVerificationNote: note
    };

    if (status === 'verified') {
      updates.isTinVerified = true;
      updates.isEligible = true;
    } else if (status === 'rejected') {
      updates.isTinVerified = false;
      updates.isEligible = false;
    }

    await userRepository.update(userId, updates);
    return { message: `TIN verification ${status}` };
  };

  static checkEligibility = async (userId) => {
    const user = await userRepository.findById(userId);
    abortIf(!user, httpStatus.NOT_FOUND, 'User not found');

    const canBid = user.canBid();
    return {
      isEligible: canBid,
      requirements: {
        emailVerified: user.isEmailVerified,
        tinVerified: user.isTinVerified,
        tinStatus: user.tinVerificationStatus
      }
    };
  };

  static resetPassword = async (email) => {
    const user = await userRepository.findByEmail(email);
    abortIf(!user, httpStatus.NOT_FOUND, 'User not found');

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await userRepository.update(user._id, {
      resetToken,
      resetTokenExpiry
    });

    const response = { message: 'Password reset instructions sent to your email' };
    
    // Only include reset token in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      response.resetToken = resetToken;
    }

    return response;
  };

  static confirmResetPassword = async (token, newPassword) => {
    const user = await userRepository.findOne({
      query: {
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }
      }
    });

    abortIf(!user, httpStatus.BAD_REQUEST, 'Invalid or expired reset token');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.update(user._id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    });

    return { message: 'Password has been reset successfully' };
  };
}

module.exports = {
  AuthService,
};
