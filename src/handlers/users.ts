import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import isEmail from 'validator/lib/isEmail'
import UserModel from '../models/user.model'
import { Types } from 'mongoose'
import { v4 as uuidv4 } from 'uuid';

const secret = process.env.SECRET as string

export class Onboarding {

    static async register(req: Request, res: Response) {

        const { name, email, password } = req.body

        try {

            if (!isEmail(req.body.email)) {
                return res.status(400).json({ message: 'Email Invalid' })
            } else {

                const getEmail = await UserModel.exists({ email: req.body.email })

                if (getEmail !== null) {
                    return res.status(400).json({ message: 'User Already Exists' })
                } else {
                    return UserModel.create({
                        name: name,
                        email: email,
                        hash: bcrypt.hashSync(password, 5),
                        wallet: { address: uuidv4() }
                    }).then((user) => {
                        const {__v, hash, ...payload } = user._doc

                        return res.status(200).json({
                            success: true,
                            message: 'Sign Up successful!',
                            data: payload
                        })
                    })
                }
            }

        } catch (error) {
            throw new Error((error as Error).message);
        }
    }


    static async signIn(req: Request, res: Response) {

        try {

            const { email, password } = req.body

            if (!isEmail(email)) {
                return res.status(400).json({ message: 'Invalid Email' })
            } else {

                const user = await UserModel.findOne({ email: email })

                if (user) {
                    const payload = {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        wallet: user.wallet
                    }

                    if (!bcrypt.compareSync(password, user.hash)) {
                        return res.status(400).json({ message: 'Invalid Password' })
                    } else {
                        return res.status(200).json({
                            success: true,
                            message: 'Sign in Successful',
                            data: {
                                ...payload,
                                token: jwt.sign(
                                    { ...payload },
                                    secret,
                                    { expiresIn: '7d' }
                                )
                            }
                        })
                    }

                } else {
                    return res.status(400).json({ message: 'Email or password incorrect' })
                }
            }

        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

}


export class UserCredentials {


    static async resetPassword(req: Request, res: Response) {

        const { email, newPassword, confirmNewPassword } = req.body
        const checkPaswordMatch = newPassword === confirmNewPassword

        try {

            if (!isEmail(email)) {
                return res.status(400).json({ success: false, message: 'Invalid Email' })
            } else {

                const query = { email: email }
                const update = { hash: bcrypt.hashSync(newPassword, 10) }

                UserModel.findOneAndUpdate(query, { $set: update }, (error: any, document: any) => {
                    if (error) throw new Error(`Error: ${error.message}`);

                    if (!document) {
                        return res.status(400).json({
                            success: false,
                            message: 'This user doesn\'t exist'
                        })
                    } else {
                        return !checkPaswordMatch
                            ? res.status(400).json({ message: 'Passwords do not match' })
                            : res.status(200).json({
                                success: true,
                                message: 'Password Changed'
                            })
                    }
                    
                })
            }

        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

}


export class UserLookup {

    static async getAllUsers(req: Request, res: Response) {

        try {

            const filters = { isDeleted: false }

            UserModel.find(filters).then((users) => {
                return res.status(200).json({
                    success: true,
                    count: users.length,
                    data: users
                })
            })
        } catch (error) {
            throw new Error((error as Error).message);
        }

    }


    static getAUser(req: Request, res: Response) {

        const id = req.params.id

        try {

            if (Types.ObjectId.isValid(id)) {
                UserModel.findOne({ _id: id })
                    .then((user) => {
                        !user
                            ? res.status(404).json({ success: false, message: 'User not found' })
                            : res.status(200).json({ success: true, message: 'User retrieved successfully', data: user })
                    })
            } else {
                return res.status(404).json({ success: false, message: 'Invalid Id' })
            }
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

}


export class UserRemover {

    static async deleteAUser(req: Request, res: Response) {

        try {
            const userId = req.params.id

            if (Types.ObjectId.isValid(userId)) {

                const query = { _id: userId }
                const update = { isDeleted: true }

                UserModel.findOneAndUpdate(query, { $set: update }, (error: any, document: any) => {
                    if (error) throw new Error(`Error: ${error.message}`);

                    if (!document) {
                        return res.status(400).json({
                            success: false,
                            message: 'This user doesn\'t exist'
                        })
                    } else {
                        return res.status(200).json({
                            success: true,
                            message: 'Successfully deleted'
                        })

                    }

                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Invalid ID'
                })
            }
        } catch (error) {
            throw new Error((error as Error).message);
        }

    }

}