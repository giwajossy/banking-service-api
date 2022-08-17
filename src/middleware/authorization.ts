import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { getToken } from './utils'

const secret = process.env.SECRET as string

export interface IToken {
    balance: number;
}

export const authorizeUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = getToken(req)
    try {
        jwt.verify(token, secret, (err, decoded) => {
            if ( (decoded ) ) {
                return next() 
            } else {
                return res.status(403).json({ message: 'Forbidden' }) 
            }
        })
    } catch (err) {
        return res.json(err)
    }
}

