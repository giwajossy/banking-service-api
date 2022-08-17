import { Request, Response } from 'express'
import { BaseHandler } from '../interfaces/handler'
import TransactionModel from '../models/transaction/transaction.model'
import { Types } from 'mongoose'
import UserModel from '../models/user/user.model'


export class Transaction extends BaseHandler {

    static async fundWallet(req: Request, res: Response) {

        const { amount } = req.body

        try {
            const newTransaction = new TransactionModel({
                sender: res.locals.user._id,
                type: 'deposit',
                recipient: res.locals.user.wallet.address,
                amount: amount
            })

            const getUser = await UserModel.findOne({ _id: res.locals.user._id })
            if (getUser) {
                getUser.wallet.balance += Number(amount)
                getUser.save()

                newTransaction.save().then(async (transaction) => {

                    const { sender, createdAt, recipient, __v, ...payload } = transaction._doc

                    return res.status(200).json({
                        success: true,
                        message: 'Operation successful',
                        data: payload
                    })
                })
            }

        } catch (error) {
            throw new Error((error as Error).message)
        }

    }


    static async withdrawFunds(req: Request, res: Response) {

        const { amount } = req.body

        try {
            const newTransaction = new TransactionModel({
                sender: res.locals.user._id,
                type: 'withdrawal',
                recipient: res.locals.user.wallet.address,
                amount: amount
            })

            const user = await UserModel.findOne({ _id: res.locals.user._id })

            if (user) {
                if (user.wallet.balance >= amount) {
                    user.wallet.balance -= Number(amount)
                    user.save()

                    newTransaction.save().then(async (transaction) => {

                        const { sender, createdAt, recipient, __v, ...payload } = transaction._doc

                        return res.status(200).json({
                            success: true,
                            message: 'Operation Successful',
                            data: payload
                        })
                    })
                } else {
                    return res.json({
                        success: false,
                        message: 'Insufficient Funds'
                    })
                }

            } else {
                return res.status(404).json({success: false,message: 'Recipient not found'})
            }

        } catch (error) {
            throw new Error((error as Error).message)
        }

    }


    static async transferFunds(req: Request, res: Response) {

        const { recipientAddress, amount } = req.body

        try {

            const newTransaction = new TransactionModel({
                sender: res.locals.user._id,
                type: 'transfer',
                recipient: recipientAddress,
                amount: amount
            })

            let getSender = await UserModel.findOne({ _id: res.locals.user._id })
            let getRecipient = await UserModel.findOne({ 'wallet.address': { $eq: recipientAddress } })

            if (getSender && getRecipient) {
                if (getSender.wallet.balance >= amount) {

                    // debit sender
                    getSender.wallet.balance -= Number(amount)
                    await getSender.save()

                    // credit recipient
                    getRecipient.wallet.balance += Number(amount)
                    await getRecipient.save()

                    newTransaction.save().then(async (transaction) => {

                        const { sender, createdAt, __v, ...payload } = transaction._doc

                        return res.status(200).json({
                            success: true,
                            message: 'Operation Successful',
                            data: payload
                        })
                    })
                } else {
                    return res.json({
                        success: false,
                        message: 'Insufficient Funds'
                    })
                }
            } else {
                return res.json({ success: false, message: 'Operation failed.' })
            }

        } catch (error) {
            throw new Error((error as Error).message)
        }

    }


    static async getTransactionHistory(req: Request, res: Response) {

        const { id } = res.locals.user._id

        try {

            if (Types.ObjectId.isValid(id)) {
                TransactionModel.find({ author: id })
                    .then((user) => {
                        !user
                            ? res.status(404).json({ success: false, message: 'Error retrieving history' })
                            : res.status(200).json({ success: true, message: 'Operation successful', data: user })
                    })
            } else {
                return res.status(422).json({ success: false, message: 'Invalid Id' })
            }
        } catch (error) {
            throw new Error((error as Error).message)
        }


    }




}




