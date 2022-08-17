import express from 'express'
import {Onboarding, UserCredentials} from '../handlers/users'

const router = express.Router()

router
    .route('/register')
    .post(Onboarding.register)

router
    .route('/signin')
    .post(Onboarding.signIn)

router
    .route('/resetpassword')
    .patch(UserCredentials.resetPassword)


export default router
