import { Router } from 'express';
import { isAuth } from '../middleware/isAuth';
import { getUserData } from '../controllers/user';

const router = Router();

router.get('/user', isAuth, getUserData);

export default router;
