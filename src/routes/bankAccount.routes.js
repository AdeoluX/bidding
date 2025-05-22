const express = require('express');
const router = express.Router();
const { BankAccountController } = require('../controllers/bankAccount.controller');
const { Authorization } = require('../utils/authorization.service');

router.get('/banks', Authorization.authenticateToken, BankAccountController.getBanks);
router.get('/bank-accounts', Authorization.authenticateToken, BankAccountController.getUserBankAccounts);
router.post('/bank-accounts', Authorization.authenticateToken, BankAccountController.addBankAccount);
router.put('/bank-accounts/:accountId/active', Authorization.authenticateToken, BankAccountController.setActiveAccount);
router.delete('/bank-accounts/:accountId', Authorization.authenticateToken, BankAccountController.removeBankAccount);

module.exports = router; 