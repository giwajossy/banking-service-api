import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { getToken } from './utils'
import { ObjectId } from 'mongoose'
import userModel from '../models/user/user.model'


const secret = process.env.SECRET as string

export interface IDecodedToken {
  _id: ObjectId;
  email: string;
  first_name: string;
}


// Validate token, and store the current user's data
export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = getToken(req)
      
  if (token) {
    jwt.verify(token, secret, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null
        return res.status(401).json({
          message: 'Access Denied'
        })
      } else {
        const user = await userModel.findById((decodedToken as IDecodedToken)._id)
        res.locals.user = user
        return next()
      }
    })
  } else {
    res.locals.user = null
    return next()
  }
  
}

export default validateToken
