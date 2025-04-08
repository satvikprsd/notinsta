import sharp from'sharp';
import cloudinary from '../components/cloudinary.js';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';

export const addNewPost = async (req, res) => {
    try{
        const { caption} = req.body;
        const image = req.file;
        const userId = req.id;

        if(!image) return res.status(400).json({message: 'No image provided', success: false});

        const compressedImageBuffer = await sharp(image.buffer).resize({width: 800, height: 600, fit: 'inside'}).toFormat('jpeg',{quality:80}).toBuffer();

        const fileUri = `data:image/jpeg;base64,${compressedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const newPost = await Post.create({caption, image: cloudResponse.secure_url, author: userId});

        const user = await User.findByIdAndUpdate(userId, {$push: {posts: newPost._id}}, {new: true});

        await newPost.populate({path: 'author', select:'-password'});
        
        return res.status(201).json({success: true, message: 'Post added successfully', post: newPost});
        
    }
    catch(error){
        console.error(error);
    }
}

export const getAllFeedPost = async (req, res) => {
    try{
        const userID = req.id;
        const posts = await Post.find().sort({createdAt: -1})
        .populate({path: 'author', select:'-password -email'})
        .populate({path: 'comments', sort:{createdAt:-1}, populate:{path:'author', select:'username,profilePic'}});
        return res.status(200).json({success: true, posts});
    }
    catch(error){
        console.error(error);
    }
}

export const getAllPostsByUser = async (req, res) => {
    try{
        const userId = req.id;
        const posts = await Post.find({author: userId}).sort({createdAt: -1})
        .populate({path: 'author', select:'-password,-email'})
        .populate({path: 'comments', sort:{createdAt:-1}, populate:{path:'author', select:'username,profilePic'}});
        return res.status(200).json({success: true, posts});
    }
    catch(error){
        console.error(error);
    }
}

export const likeOrDislikePost = async (req, res) => {
    try{
        const userId = req.id;
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        console.log(post);
        if (post.likes.includes(userId)) {
            await Post.findByIdAndUpdate(postId, {$pull: {likes: userId}}, {new: true});
            return res.status(200).json({success: true, message: 'Post disliked successfully'});
        }
        else {
            await Post.findByIdAndUpdate(postId, {$addToSet: {likes: userId}}, {new: true});
            return res.status(200).json({success: true, message: 'Post liked successfully'});
        }
    }
    catch(error){
        console.error(error);
    }
}

export const addCommentToPost = async (req, res) => {
    try{
        const postId = req.params.postId;
        const userId = req.id;
        const { comment } = req.body;
        console.log(req.body);
        if (!comment) return res.status(400).json({message: 'No comment provided', success: false});
        const user = await User.findById(userId);
        const newcomment = {user:userId, username: user.username, profilePic: user.profilePic, comment}
        const post = await Post.findByIdAndUpdate(postId, {$push: {comments: newcomment}}, {new: true});
        // await post.populate({path: 'author', select:'username,profilePic'});
        await post.populate({path: 'comments', sort:{createdAt:-1}, populate:{path:'author', select:'username,profilePic'}});
        return res.status(201).json({success: true, message: 'Comment added successfully', newcomment});
    }
    catch(error){
        console.error(error);
    }
};

export const getCommentsByPost = async (req, res) => {
    try{
        const postId = req.params.postId;
        const comments = await Post.findById(postId).select('comments').sort({createdAt:-1});
        if (!comments) return res.status(404).json({message: 'No comments found', success: false});
        return res.status(200).json({success: true, comments});
    }
    catch(error){
        console.error(error);
    }
};

export const deletePost = async (req, res) => {
    try{
        const postId = req.params.postId;
        const userId = req.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({message: 'Post not found', success: false});
        if (post.author.toString() !== userId) return res.status(403).json({message: 'Nahi kar skta delete isko', success: false});
        const publicId = post.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
        await Post.findByIdAndDelete(postId);
        await User.findByIdAndUpdate(userId, {$pull: {posts: postId}});
        return res.status(200).json({success: true, message: 'Post deleted successfully'});
    }
    catch(error){
        console.error(error);
    }
};

export const savePost = async (req, res) => {
    try{
        const postId = req.params.postId;
        const userId = req.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({message: 'Post not found', success: false});
        const user = await User.findByIdAndUpdate(userId);
        if (user.savedPosts.includes(postId)) {
            await User.findByIdAndUpdate(userId, {$pull: {savedPosts: postId}});
            return res.status(200).json({success: true, message: 'Post unsaved successfully'});
        }
        else{
            await User.findByIdAndUpdate(userId, {$push: {savedPosts: postId}});
            return res.status(200).json({success: true, message: 'Post saved successfully', post});
        }
    }
    catch(error){
        console.error(error);
    }
};