import express from 'express';
import { isauthenticated } from '../middleware/isAuth.js';
import { getAllLastMessages, getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.route('/send/:receiverId').post(isauthenticated, sendMessage);
router.route('/all/:receiverId').get(isauthenticated, getMessages);
router.route('/alllastmsg').get(isauthenticated, getAllLastMessages);

export default router;