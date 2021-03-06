import 'reflect-metadata';
import express from 'express';
import fs from 'fs';
import path from 'path';
import https from 'https';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createConnection } from 'typeorm';
import { morganMiddleware } from './middleware/morganMiddleware';
import { CLIENT_BASE_URL, SESSION_SECRET } from './config';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import eventRouter from './routes/event';

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
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, '..', 'public')));

  let retries = 5;

  if (retries > 0) {
    try {
      await createConnection();
    } catch (err) {
      console.log(err);
      retries -= 1;
      // wait for 5 seconds
      await new Promise((res) => {
        setTimeout(res, 5000);
      });
    }
  }

  app.get('/', (_, res) => {
    res.send('Hello this is an app');
  });

  app.post('/', (req) => {
    console.log(req.body);
  });

  app.get('/login', (_, res) => {
    return res.send('This is login page');
  });

  app.get('/success', (_, res) => {
    return res.send('Success Login');
  });

  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/event', eventRouter);

  https
    .createServer(
      {
        key: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'private.key')),
        cert: fs.readFileSync(
          path.join(__dirname, '..', 'ssl', 'certificate.crt')
        ),
      },
      app
    )
    .listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });

  // app.listen(PORT, () => {
  //   console.log(`Server is running on PORT ${PORT}`);
  // });

  return app;
};
