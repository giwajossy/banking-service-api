import { Request, Response } from 'express'
import { BaseHandler } from '../interfaces/handler'


class getInvalidRoute extends BaseHandler {

    /* GET Bad route */
    static getInvalidRoute(req: Request, res: Response) {

        res.status(404).json(
            {
                success: false,
                message: 'Invalid Route. Please confirm your endpoint.'
            })

    }

}



export default getInvalidRoute