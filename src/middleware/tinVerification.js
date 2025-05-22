const { abortIf } = require('../utils/responder');
const httpStatus = require('http-status');
const userRepository = require('../repo/user.repo');

const checkTinVerification = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming user ID is attached to request by auth middleware
    const user = await userRepository.findById(userId);
    
    abortIf(!user, httpStatus.NOT_FOUND, 'User not found');
    abortIf(!user.isTinVerified, httpStatus.FORBIDDEN, 'TIN verification required');
    abortIf(user.tinVerificationStatus !== 'verified', httpStatus.FORBIDDEN, 'TIN verification pending or rejected');

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkTinVerification
}; 