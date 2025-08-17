import express from 'express';
import { followOrUnfollowUser, getConvos, getCurrentSong, getProfile, getSavedPosts, getSuggestions, login, logout, register, searchUser, spotifyConnect, spotifyDisconnect, updateProfile } from '../controllers/user.controller.js';
import { isauthenticated } from '../middleware/isAuth.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:username/profile').get(getProfile);
router.route('/profile/edit').post(isauthenticated, upload.single('profilePic'), updateProfile);
router.route('/suggestions').get(isauthenticated, getSuggestions);
router.route('/savedposts').get(isauthenticated, getSavedPosts);
router.route('/followorunfollow/:id').get(isauthenticated, followOrUnfollowUser);
router.route('/search/:username').get(isauthenticated,searchUser);
router.route('/getconvos').get(isauthenticated, getConvos);
router.route('/spotify-connect').get(isauthenticated, spotifyConnect);
router.route('/spotify-disconnect').get(isauthenticated, spotifyDisconnect);
router.route('/current-song/:id').get(getCurrentSong);
export default router;