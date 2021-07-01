import { Router } from 'express';
import { isAuth } from '../middleware/isAuth';
import { getUserData, patchUpdateUser } from '../controllers/user';

const router = Router();

//TODO: I have no idea why
// if I switch the position of patch router with the position of get router,
// I cannot get the status code at the client-side
router.patch('/:userUid', isAuth, patchUpdateUser);
router.get('/', isAuth, getUserData);

export default router;
