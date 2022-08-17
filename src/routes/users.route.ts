import express from 'express'
import { UserLookup, UserRemover } from '../handlers/users'
import validateToken from '../middleware/validate-token'
import { authorizeUser} from '../middleware/authorization'

const router = express.Router()

router
    .route('/:id')
    .get(validateToken, authorizeUser, UserLookup.getAUser)
    .delete(validateToken, authorizeUser, UserRemover.deleteAUser)

router
    .route('/')
    .get(validateToken, authorizeUser, UserLookup.getAllUsers)


export default router
