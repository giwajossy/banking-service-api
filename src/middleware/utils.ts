import { Request, Response, NextFunction  } from 'express'

export const getToken = (req: Request) => {
  const token = req.headers.authorization
  return token ? token.split(' ')[1] : ''
}


// CORS middleware
export const cors = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,  Accept, Authorization');
  return next();
};

