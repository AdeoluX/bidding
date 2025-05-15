const express = require('express');
const router = express.Router();
const { BankAccountController } = require('../controllers/bankAccount.controller');
const { Authorization } = require('../utils/authorization.service');

/**
 * @swagger
 * components:
 *   schemas:
 *     BankAccount:
 *       type: object
 *       required:
 *         - accountNumber
 *         - bankCode
 *       properties:
 *         accountNumber:
 *           type: string
 *           description: The bank account number
 *         bankCode:
 *           type: string
 *           description: The bank code from Paystack
 *         accountName:
 *           type: string
 *           description: The name on the bank account
 *         isActive:
 *           type: boolean
 *           description: Whether this is the active account
 *         subaccountCode:
 *           type: string
 *           description: The Paystack subaccount code
 */

/**
 * @swagger
 * /api/v1/banks:
 *   get:
 *     summary: Get list of all banks
 *     tags: [Bank Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of banks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       code:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/banks', Authorization.authenticateToken, BankAccountController.getBanks);

/**
 * @swagger
 * /api/v1/bank-accounts:
 *   get:
 *     summary: Get user's bank accounts
 *     tags: [Bank Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's bank accounts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BankAccount'
 *       401:
 *         description: Unauthorized
 */
router.get('/bank-accounts', Authorization.authenticateToken, BankAccountController.getUserBankAccounts);

/**
 * @swagger
 * /api/v1/bank-accounts:
 *   post:
 *     summary: Add a new bank account
 *     tags: [Bank Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *               - bankCode
 *             properties:
 *               accountNumber:
 *                 type: string
 *               bankCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bank account added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BankAccount'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/bank-accounts', Authorization.authenticateToken, BankAccountController.addBankAccount);

/**
 * @swagger
 * /api/v1/bank-accounts/{accountId}/active:
 *   put:
 *     summary: Set a bank account as active
 *     tags: [Bank Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: The bank account ID
 *     responses:
 *       200:
 *         description: Bank account set as active successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BankAccount'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bank account not found
 */
router.put('/bank-accounts/:accountId/active', Authorization.authenticateToken, BankAccountController.setActiveAccount);

/**
 * @swagger
 * /api/v1/bank-accounts/{accountId}:
 *   delete:
 *     summary: Remove a bank account
 *     tags: [Bank Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: The bank account ID
 *     responses:
 *       200:
 *         description: Bank account removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bank account not found
 */
router.delete('/bank-accounts/:accountId', Authorization.authenticateToken, BankAccountController.removeBankAccount);

module.exports = router; 