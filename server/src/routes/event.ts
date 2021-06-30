import { Router } from 'express';
import { isAuth } from '../middleware/isAuth';
import {
  postCreateNewEvent,
  putModifyEvent,
  deleteEvent,
  postCreateTodo,
  patchModifyTodo,
  putUpdateTodo,
} from '../controllers/event';

const router = Router();
router.use(isAuth);

router.post('/e', postCreateNewEvent);
//TODO: should be patch
router.put('/e/:uid', putModifyEvent);
router.delete('/e/:uid', deleteEvent);

router.post('/todo', postCreateTodo);
router.patch('/todo/:uid', patchModifyTodo);
router.put('/todo', putUpdateTodo);

export default router;
