import express from 'express';
import InvalidRoute from '../handlers/404'

const router = express.Router()

router.get('*', InvalidRoute.getInvalidRoute);

export default router;