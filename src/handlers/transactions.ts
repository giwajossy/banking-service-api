import { Request, Response } from 'express'
import { BaseHandler } from '../interfaces'
import TransactionModel from '../models/transaction.model'
import { Types } from 'mongoose'
import UserModel from '../models/user.model'
import { IUser, ITransaction } from '../interfaces'


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
                await getUser.save()

                await newTransaction.save().then(async (transaction) => {

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
                return res.status(404).json({ success: false, message: 'Recipient not found' })
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

                    await newTransaction.save().then(async (transaction) => {

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
                return res.status(404).json({ success: false, message: 'Recipient not found' })
            }

        } catch (error) {
            throw new Error((error as Error).message)
        }

    }



    static async transferFundsXXX(req: Request, res: Response) {

        const { recipientAddress, amount } = req.body

        try {

            // const newTransaction = new TransactionModel({
            //     sender: res.locals.user._id,
            //     type: 'transfer',
            //     recipient: recipientAddress,
            //     amount: amount
            // })

            // let getSender = await UserModel.findOne({ _id: res.locals.user._id })

            // let getRecipient = await UserModel.findOne({ 'wallet.address': { $eq: recipientAddress } })

            // if (getSender && getRecipient) {
            //     if (getSender.wallet.balance >= amount) {

            //         // debit sender
            //         getSender.wallet.balance -= Number(amount)
            //         await getSender.save()

            //         // credit recipient
            //         getRecipient.wallet.balance += Number(amount)
            //         await getRecipient.save()

            //         await newTransaction.save().then(async (transaction) => {

            //             const { sender, createdAt, __v, ...payload } = transaction._doc

            //             return res.status(200).json({
            //                 success: true,
            //                 message: 'Operation Successful',
            //                 data: payload
            //             })
            //         })
            //     } else {
            //         return res.json({
            //             success: false,
            //             message: 'Insufficient Funds'
            //         })
            //     }
            // } else {
            //     return res.status(404).json({ success: false, message: 'Recipient not found' })
            // }

            const newTransaction = new TransactionModel({
                sender: res.locals.user._id,
                type: 'transfer',
                recipient: recipientAddress,
                amount: amount
            })

            UserModel.findOne({ _id: res.locals.user._id }, (err: any, foundSender: IUser) => {

                if (err) return res.status(404).json({ success: false, message: 'unable to fetch sender' })
                UserModel.findOne({ 'wallet.address': { $eq: recipientAddress } }, (err: any, foundRecipient: IUser) => {
                    if (err) return res.status(404).json({ success: false, message: 'unable to fetch recipient' })
                    if (foundSender && foundRecipient) {
                        if (foundSender.wallet.balance >= amount) {

                            // debit sender
                            foundSender.wallet.balance -= Number(amount)
                            foundSender.save()

                            // credit recipient
                            foundRecipient.wallet.balance += Number(amount)
                            foundRecipient.save()

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
                        return res.status(404).json({ success: false, message: 'Recipient not found' })
                    }


                })
            })



        } catch (error) {
            throw new Error((error as Error).message)
        }

    }


    static async getTransactionHistory(req: Request, res: Response) {

        const { id } = res.locals.user._id

        try {

            if (Types.ObjectId.isValid(id)) {
                TransactionModel.find({ sender: new Types.ObjectId(id) })
                    .then((transaction) => {
                        !transaction
                            ? res.status(404).json({ success: false, message: 'Error retrieving history' })
                            : res.status(200).json({ success: true, message: 'Operation successful', data: transaction })
                    }).catch(err => console.log(err))
            } else {
                return res.status(422).json({ success: false, message: 'Invalid Id' })
            }
        } catch (error) {
            throw new Error((error as Error).message)
        }

    }




}





