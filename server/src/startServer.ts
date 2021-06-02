import 'reflect-metadata';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
// import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createConnection } from 'typeorm';
import { morganMiddleware } from './middleware/morganMiddleware';
import { CLIENT_BASE_URL, SESSION_SECRET } from './config';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import startTwitterPassport from './configStarter/startTwitterPassport';

export default async () => {
  const PORT = process.env.PORT || 5000;
  const app = express();
  app.use(cookieParser());

  app.use(
    cors({
      origin: CLIENT_BASE_URL,
      optionsSuccessStatus: 200,
      credentials: true,
    })
  );
  // app.use('/auth', createProxyMiddleware(proxyOptions));

  app.use(function (_, res, next) {
    res.header('Access-Control-Allow-Origin', CLIENT_BASE_URL);
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });
  app.use(morganMiddleware);
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
    })
  );

  const connection = await createConnection();

  startTwitterPassport(connection, passport);

  app.use(passport.initialize());

  app.get('/', (_req, res) => {
    res.send('Hello this is an app');
  });

  app.get('/login', (_, res) => {
    return res.send('This is login page');
  });

  app.get('/success', (_, res) => {
    return res.send('Success Login');
  });

  app.use('/auth', authRouter);

  app.use('/user', userRouter);

  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });

  return app;
};
