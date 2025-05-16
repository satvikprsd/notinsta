import express from 'express';
import { isauthenticated } from '../middleware/isAuth.js';
import { getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.route('/send/:receiverId').post(isauthenticated, sendMessage);
router.route('/all/:receiverId').get(isauthenticated, getMessages);

export default router;