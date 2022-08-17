import express from 'express'
import { Transaction } from '../handlers/transactions'
import validateToken from '../middleware/validate-token'
import { authorizeUser } from '../middleware/authorization'

const router = express.Router()

router
    .route('/fund_wallet')
    .post(validateToken, authorizeUser, Transaction.fundWallet)

router
    .route('/withdraw_funds')
    .post(validateToken, authorizeUser, Transaction.withdrawFunds)

router
    .route('/transfer_funds')
    .post(validateToken, authorizeUser, Transaction.transferFunds)

router
    .route('/transaction_history')
    .get(validateToken, authorizeUser, Transaction.getTransactionHistory)

export default router
