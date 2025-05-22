const catchAsync = require('../utils/catchAsync');
const { AuthService } = require('../services');
const { successResponse } = require('../utils/responder');
const httpStatus = require('http-status');

class AuthController {
  // Signup
  static signup = catchAsync(async (req, res, next) => {
    const { firstname, lastname, email, password, phone, address, tin } = req.body;
    
    const entity = await AuthService.signup({
      email,
      password,
      firstname,
      lastname,
      phone,
      address,
      tin
    });
    return successResponse(req, res, entity, 'Successfully signed up');
  });

  static signIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const entity = await AuthService.signIn(email, password);
    return successResponse(req, res, entity, 'Successfully signed in');
  });

  static verifyEmail = catchAsync(async (req, res, next) => {
    const { token } = req.params;
    const entity = await AuthService.verifyEmail(token);
    return successResponse(req, res, entity, 'Email verified successfully');
  });

  static verifyTin = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const { status, note } = req.body;
    const entity = await AuthService.verifyTin(userId, status, note);
    return successResponse(req, res, entity, 'TIN verification status updated');
  });

  static checkEligibility = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const entity = await AuthService.checkEligibility(userId);
    return successResponse(req, res, entity, 'Eligibility check completed');
  });

  static resetPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const entity = await AuthService.resetPassword(email);
    return successResponse(req, res, entity, 'Password reset initiated');
  });

  static confirmResetPassword = catchAsync(async (req, res, next) => {
    const { token, newPassword } = req.body;
    const entity = await AuthService.confirmResetPassword(token, newPassword);
    return successResponse(req, res, entity, 'Password reset completed');
  });
}

module.exports = {
  AuthController,
};
