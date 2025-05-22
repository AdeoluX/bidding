const express = require('express');
const {
  AuthController,
} = require('../controller/auth.controller');
const { validateReq } = require('../middleware/validate');
const { 
  signInSchema, 
  signUpSchema, 
  verifyTinSchema,
  checkEligibilitySchema,
  resetPasswordSchema,
  confirmResetPasswordSchema 
} = require('../validations/auth.validations');
const Authorization = require('../utils/authorization.service');
const router = express.Router();

const BASE = '/auth';

router.post(`${BASE}/sign-in`, validateReq(signInSchema), AuthController.signIn);
router.post(`${BASE}/sign-up`, validateReq(signUpSchema), AuthController.signup);
router.get(`${BASE}/verify-email/:token`, AuthController.verifyEmail);
router.post(`${BASE}/verify-tin/:userId`, Authorization.authenticateToken, validateReq(verifyTinSchema), AuthController.verifyTin);
router.get(`${BASE}/check-eligibility/:userId`, Authorization.authenticateToken, validateReq(checkEligibilitySchema), AuthController.checkEligibility);
router.post(`${BASE}/reset-password`, validateReq(resetPasswordSchema), AuthController.resetPassword);
router.post(`${BASE}/confirm-reset-password`, validateReq(confirmResetPasswordSchema), AuthController.confirmResetPassword);

module.exports = router;
