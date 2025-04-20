import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from '../components/datauri.js';
import cloudinary from '../components/cloudinary.js';

export const register = async(req,res) => {
    try {
        const {username, email, password } = req.body;
        console.log(req.body);
        if (!username ||!email ||!password) {
            return res.status(400).json({ success: false, message: 'Please fill all fields' });
        }
        const user = await User.findOne({ $or: [{username}, {email}] });
        if (user) {
            return res.status(400).json({ success: false, message: 'Username or email already exists' });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password:hashedPassword
        });
        setTimeout(()=>{return res.status(201).json({ success: true, message: "User created successfully"})},1000); //timeout for testing animations
    }
    catch (error) {
        console.error(error);
    }
}

export const login = async(req,res) => {
    try{
        const {usernameoremail, password } = req.body;
        if (!usernameoremail ||!password) {
            return res.status(400).json({ success: false, message: 'Please fill all fields' });
        }
        let user = await User.findOne({ email:usernameoremail });
        if (!user) {
            user = await User.findOne({ username:usernameoremail });
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }

        const populatedPosts = await User.findById(user._id).populate({path: 'posts', match:{author:user._id} });
        const populatedFollowers = await User.findById(user._id).populate({path:'followers', select:'username profilePic'});
        const populatedFollowing = await User.findById(user._id).populate({path:'following', select:'username profilePic'});
        
        const userData = {
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            bio: user.bio,
            followers: populatedFollowers.followers,
            following: populatedFollowing.following,
            posts: populatedPosts.posts,
            likes: user.likes,
            saved: user.savedPosts
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        setTimeout(()=>{return res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24*60*60*1000 }).json({
            success: true,
            message: `${user.username} logged in successfully`,
            user: userData
        })},1000); //Timeout only for me to test the loading animation
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error });
    }
};

export const logout = async(req,res) => {
    try {
        res.clearCookie('token', { path: '/' });
        return res.status(200).json({ success: true, message: 'User logged out successfully' });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error });
    }
};

export const getProfile = async(req,res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password").populate("followers", "username profilePic").populate("following", "username profilePic").populate({path: "posts",populate: {path: "author",select: "-password",}
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.json({ success: true, user });
    }
    catch (error) {
        console.error(error);
    }
};

export const updateProfile = async(req,res) => {
    try {
        const userID = req.id;
        const { username, name, bio } = req.body;
        const profilePic = req.file;
        let cloudResponse;

        if (profilePic){
            const fileUri = getDataUri(profilePic);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if(bio) user.bio = bio;
        if(name) user.name = name;
        if(username) {
            const searchuser = await User.findOne({username});
            if (searchuser) {return res.status(400).json({ success: false, message: 'Username or email already exists' });}
            user.username = username;}
        if(profilePic && cloudResponse) user.profilePic = cloudResponse.secure_url;

        await user.save();
        return res.json({ success: true, message: 'Profile updated successfully', user });
    }
    catch (error) {
        console.error(error);
    }
};

export const getSuggestions = async(req,res) => {
    try {
        const CurUser = await User.findById(req.id);
        const exclude = [CurUser._id, ...CurUser.following.map((f)=>f._id)]
        const suggestions = await User.find({_id:{$nin:exclude}}).select("-password").limit(10);
        if (!suggestions) {
            return res.status(400).json({ success: false, message: 'You are the only one :)' });
        }
        return res.status(200).json({ success: true, suggestions });
    }
    catch (error) {
        console.error(error);
    }
};

export const getSavedPosts = async(req,res) => {
    const userID = req.id
    try {
        const user = await User.findById(userID)
        .populate('savedPosts')
        const savedPosts = user.savedPosts
        return res.status(200).json({success: true, savedPosts})
    }catch(e){
        console.error(e);
        res.status(400).json({ success: false, message: e})
    }
}

export const followOrUnfollowUser = async(req,res) => {
    
    try {
        const userID = req.id;
        const toBeFollowedUserId  = req.params.id;
        if (userID === toBeFollowedUserId) {
            return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
        }
        const user = await User.findById(userID);
        const targetUser = await User.findById(toBeFollowedUserId);
        if (!user || !targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.following.includes(toBeFollowedUserId)) {
            user.following = user.following.filter(id => id.toString() !== toBeFollowedUserId.toString());
            targetUser.followers = targetUser.followers.filter(id => id.toString() !== userID.toString());
            await user.save();
            await targetUser.save();
            return res.json({ success: true, message: 'User unfollowed successfully' });
        } else {
            user.following.push(toBeFollowedUserId);
            targetUser.followers.push(userID);
            await user.save();
            await targetUser.save();
            return res.json({ success: true, message: 'User followed successfully' });
        }
    }
    catch (error) {
        console.error(error);
    }
};