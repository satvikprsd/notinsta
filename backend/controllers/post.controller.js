import sharp from'sharp';
import cloudinary from '../components/cloudinary.js';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { getSocketId } from '../socket/socketio.js';

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const file = req.file;
    const userId = req.id;
    console.log(file.type)
    if (!file) {
      return res.status(400).json({ message: 'No file provided', success: false });
    }

    let uploadResult;
    const mimeType = file.mimetype;

    if (mimeType.startsWith('image/')) {
      // Process image
      const compressedImageBuffer = await sharp(file.buffer)
        .resize({ width: 800, height: 600, fit: 'inside' })
        .toFormat('jpeg', { quality: 80 })
        .toBuffer();

      const fileUri = `data:image/jpeg;base64,${compressedImageBuffer.toString('base64')}`;
      uploadResult = await cloudinary.uploader.upload(fileUri, { resource_type: 'image' });

    } else if (mimeType.startsWith('video/')) {
      // Upload video directly
      uploadResult = await cloudinary.uploader.upload_stream(
        { resource_type: 'video' },
        async (error, result) => {
          if (error) throw error;
          return result;
        }
      );
      // Need to convert buffer to stream
      const streamifier = await import('streamifier');
      streamifier.createReadStream(file.buffer).pipe(uploadResult);
      uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'video' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });

    } else {
      return res.status(400).json({ message: 'Unsupported file type', success: false });
    }

    const newPost = await Post.create({
      caption,
      image: uploadResult.secure_url,
      author: userId,
    });

    await User.findByIdAndUpdate(
      userId,
      { $push: { posts: { $each: [newPost._id], $position: 0 } } },
      { new: true }
    );

    await newPost.populate({ path: 'author', select: '-password' });

    return res.status(201).json({
      success: true,
      message: 'Post added successfully',
      post: newPost,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


export const getAllFeedPost = async (req, res) => {
    try{
        const userID = req.id;
        const posts = await Post.find().sort({createdAt: -1})
        .populate({path: 'author', select:'-password -email'})
        .populate({path: 'comments', sort:{createdAt:-1}, populate:{path:'author', select:'name username profilePic'}})
        .populate({path: 'likes', select:'username profilePic'});
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
        .populate({path: 'comments', sort:{createdAt:-1}, populate:{path:'author', select:'username,profilePic'}})
        .populate({path: 'likes', select:'username profilePic'});
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
        if (post.likes.includes(userId)) {
            await Post.findByIdAndUpdate(postId, {$pull: {likes: userId}}, {new: true});
            return res.status(200).json({success: true, message: 'Post disliked successfully'});
        }
        else {
            await Post.findByIdAndUpdate(postId, {$addToSet: {likes: userId}}, {new: true});

            const user = await User.findById(userId).select('username profilePic');
            const postAuthorId = post.author.toString();
            if (userId != postAuthorId){
                const notification = {
                    type: 'like',
                    userId,
                    user,
                    postId,
                    message: 'Your post was liked'
                }
                
                const postAutherSocketId = getSocketId(postAuthorId);
                io.to(postAutherSocketId).emit('notification', notification);
            }
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
        if (!comment) return res.status(400).json({message: 'No comment provided', success: false});
        const user = await User.findById(userId);
        const newcomment = {author:userId, comment}
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
        const comments = await Post.findById(postId).select('comments').populate({path: 'comments.author', select: 'name username profilePic',});;
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

export const getPostbyID = async (req,res) => {
    try{
        const postId = req.params.postId;
        const post = await Post.findById(postId)
        .populate({path: 'author', select:'-password -email'})
        .populate({path: 'comments', sort:{createdAt:-1}, populate:{path:'author', select:'name username profilePic'}})
        .populate({path: 'likes', select:'username profilePic'});
        if (!post) return res.status(404).json({message: 'Post not found', success: false});
        return res.status(200).json({success: true, post})
    }
    catch(e){
        console.error(e);
        res.status(404).json({message: 'Error', success: false});
    }
}