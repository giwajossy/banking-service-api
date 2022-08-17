import 'dotenv/config'
import 'tsconfig-paths/register'
import './db/mongodb'
import createError from 'http-errors'
import express, { Request, Response } from 'express'
import { cors } from './middleware/utils'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import helmet from 'helmet';


import indexRouter from './routes/index.route'
import authRouter from './routes/auth.route'
import usersRouter from './routes/users.route'
import transactionRouter from './routes/transactions.route'
import invalidRouter from './routes/404.route'
import documentationRouter from './routes/documentation.route'

const app = express();

app.use(cors)
app.use(helmet());
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/v1/api-docs', documentationRouter)
app.use('/', indexRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/transaction/', transactionRouter)
app.use('/', invalidRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});


// error handler
app.use((err: any, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

export default app;

