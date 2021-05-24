import 'reflect-metadata';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { createConnection } from 'typeorm';
import { morganMiddleware } from './middleware/morganMiddleware';
import { SESSION_SECRET } from './config';
import authRouter from './routes/auth';
import startTwitterPassport from './configStarter/startTwitterPassport';

(async () => {
  const PORT = process.env.PORT || 5000;
  const app = express();

  app.use(morganMiddleware);
  app.use(passport.initialize());
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
    })
  );

  const connection = await createConnection();

  startTwitterPassport(connection, passport);

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

  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
})();
