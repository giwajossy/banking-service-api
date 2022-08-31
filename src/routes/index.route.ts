import express, { Request, Response} from 'express';

const router = express.Router()

/* GET home page. */   
const welcomeRoute = (req: Request, res: Response) => {
  res.status(200).json(
    { 
      success: true,
      message: 'Welcome to the Banking service API 💰'
    })
}

router.get('/',  welcomeRoute);

export default router;