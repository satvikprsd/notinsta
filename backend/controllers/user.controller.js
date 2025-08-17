import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from '../components/datauri.js';
import cloudinary from '../components/cloudinary.js';
import { Convo } from '../models/convo.model.js';
import axios from 'axios';

export const register = async(req,res) => {
    try {
        const {username, email, password } = req.body;
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
            saved: user.savedPosts,
            spotify_connected: user.spotify_connected,
            expires_at: user.expires_at,
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        return res.cookie('token', token, { 
            httpOnly: true, 
            sameSite: 'none', 
            secure: true, 
            path: '/',
            maxAge: 30*24*60*60*1000 
        }).json({
            success: true,
            message: `${user.username} logged in successfully`,
            user: userData
        }); //Timeout only for me to test the loading animation
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error });
    }
};

export const logout = async(req,res) => {
    try {
        res.clearCookie('token', { 
            path: '/',
            sameSite: 'none', 
            secure: true,
            httpOnly: true,
            domain: '.railway.app',
            partitioned: true
        });
        return res.status(200).json({ success: true, message: 'User logged out successfully' });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error });
    }
};

export const getProfile = async(req,res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password -savedPosts -access_token -refresh_token").populate("followers", "username profilePic").populate("following", "username profilePic").populate({path: "posts",populate: [{path: "author",select: "-password",},{path: "likes",select: "username profilePic",}]
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
        .populate({path: 'savedPosts',populate: [{path:'author', select:'username profilePic'},{ path: 'likes', select: 'username profilePic' }]});
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

export const searchUser = async(req, res) => {
    try {
        const username = req.params.username;
        if (!username) {
            return res.status(400).json({ success: false, message: 'This should not happen' });
        }
        const users = await User.find({
            $or: [
                { username: { $regex: username, $options: "i" } },
                { name: { $regex: username, $options: "i" } }
              ]
        })
        .limit(10)
        .select("username profilePic name")
        
        // console.log(users);
        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: error});
    }
};


export const getConvos = async(req, res) => {
    try{
        const userId = req.id;
        const allConversations = await Convo.find({ participants: userId })
            .populate('participants', 'username profilePic')
            .sort({ updatedAt: -1 })
            .lean();
        const filteredConversations = allConversations.map(convo => {
            let chatuser = convo.participants.find(p => p._id.toString() !== userId.toString());
            if (!chatuser) chatuser = convo.participants[0]
            return {
                chatuser,
                updatedAt: convo.updatedAt,
            };
        });
        return res.status(200).json({success: true, convo: filteredConversations })
    }
    catch(e){
        console.log(e);
        return res.status(400).json({success: false, message: e})
    }
}

export const spotifyConnect = async (req, res) => {
    const code = req.query.code;
    const userID = req.id;
    const user = await User.findById(userID);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!code) {
        return res.status(400).json({ error: 'Missing code parameter' });
    }

    try {
        const client_id = process.env.SPOTIFY_CLIENT_ID;
        const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
        const redirect_uri = "https://notinsta-production.up.railway.app/api/v1/user/spotify-connect";  

        const tokenResponse = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri,
                client_id,
                client_secret
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        const { access_token, refresh_token, expires_in } = tokenResponse.data;
        user.access_token = access_token;
        user.refresh_token = refresh_token;
        user.spotify_connected = true;
        user.expires_at = Date.now() + expires_in * 1000;
        await user.save();
        console.log('Spotify access token:', access_token, 'refresh token:', refresh_token, 'expires in:', expires_in);
        res.redirect(`${process.env.URL}/profile?connected=true`);
    } catch (error) {
        res.status(500).json({ error: 'Spotify token exchange failed', details: error.message });
    }
};

export const spotifyDisconnect = async (req, res) => {
    try {
        const userID = req.id;
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.spotify_connected = false;
        user.access_token = null;
        user.refresh_token = null;
        user.expires_at = null;
        await user.save();
        return res.status(200).json({ success: true, message: 'Spotify disconnected successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to disconnect Spotify', error: error.message });
    }
}

const refreshSpotifyToken = async (user) => {
    try {
        const client_id = process.env.SPOTIFY_CLIENT_ID;
        const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: user.refresh_token,
                client_id,
                client_secret
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const { access_token, expires_in } = response.data;
        user.access_token = access_token;
        user.expires_at = Date.now() + expires_in * 1000;
        await user.save();
        return access_token;
    }
    catch (error) {
        console.error('Error refreshing Spotify token:', error.message);
        throw new Error('Failed to refresh Spotify token');
    }
}

export const getCurrentSong = async (req, res) => {
    try {
        const userID = req.params.id;
        const user = await User.findById(userID);
        if (!user || !user.spotify_connected || !user.access_token) {
            return res.status(400).json({ success: false, message: 'Spotify not connected or access token missing' });
        }
        let access_token = user.access_token;

        if (!user.expires_at || Date.now() > user.expires_at) {
            access_token = await refreshSpotifyToken(user);
        }

        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        if (response.status === 204) {
            return res.status(200).json({ success: true, message: 'No song is currently playing' });
        }

        const currentSong = response.data.item;
        return res.status(200).json({ success: true, item: currentSong });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch current song', error: error.message });
    }
}