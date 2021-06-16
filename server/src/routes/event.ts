import { Router } from 'express';
import { isAuth } from '../middleware/isAuth';
import {
  postCreateNewEvent,
  putModifyEvent,
  deleteEvent,
} from '../controllers/event';

const router = Router();
router.use(isAuth);

router.post('/', postCreateNewEvent);
router.put('/:uid', putModifyEvent);
router.delete('/:uid', deleteEvent);

export default router;
