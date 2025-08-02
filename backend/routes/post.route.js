import express from "express";
import upload from "../middleware/multer.js";
import { isauthenticated } from "../middleware/isAuth.js";

import { addCommentToPost, addNewPost, deletePost, getAllFeedPost, getAllPostsByUser, getCommentsByPost, getPostbyID, likeOrDislikePost, savePost } from "../controllers/post.controller.js";



const router = express.Router();

router.route('/newpost').post(isauthenticated, upload.single('video'), addNewPost);
router.route('/feed').get(isauthenticated, getAllFeedPost);
router.route('/allposts').get(isauthenticated, getAllPostsByUser);
router.route('/:postId/likeordislike').get(isauthenticated, likeOrDislikePost);
router.route('/:postId/newcomment').post(isauthenticated, addCommentToPost);
router.route('/:postId/allcomments').get(isauthenticated, getCommentsByPost);
router.route('/delete/:postId').post(isauthenticated, deletePost);
router.route('/:postId/save').get(isauthenticated, savePost);
router.route('/getpost/:postId').get(getPostbyID);

export default router;
