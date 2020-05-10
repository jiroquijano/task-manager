const express = require('express');
const User = require('../models/user');
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const router = new express.Router();
const sharp = require('sharp');
const { sendWelcomeEmail, sendGoodByeEmail } = require('../emails/account');


const upload = multer({
    limits:{
        fileSize: 2000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image file'));
        }
        cb(undefined,true);
    }
});

router.post('/users/me/avatar', authMiddleware, upload.single('avatar'), async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer(); //format file buffer to png and resize
    req.user.avatar = buffer;
    await req.user.save();
    res.send('Image uploaded');
},(error, req, res, next)=>{ //express executes this function when an error is thrown by middleware
    res.status(400).send({error:error.message});
});

router.delete('/users/me/avatar',authMiddleware, async(req,res)=>{
    try{
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    }catch(error){
        res.status(400).send({error:error.message})
    }
});

router.get('/users/:id/avatar', async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar) throw new Error();
        res.set('Content-Type','image/png');
        res.send(user.avatar);
    }catch(error){
        res.status(404).send({error:error.message});
    }
});

//get all users using mongoose method find({...query})
router.get('/users/me', authMiddleware, async (req,res)=>{
    res.send(req.user);
});

router.post('/users/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password); //user defined method in user schema
        const token = await user.generateAuthToken();
        res.send({
            user,
            token
        });
    }catch(error){
        res.status(400).send(error);
    }
});

router.post('/users/logout', authMiddleware, async(req,res)=>{
    try{
        const user = req.user;
        user.tokens = user.tokens.filter((curr)=>{
            return curr.token != req.token;
        });
        await user.save();
        res.send('Successfully logged out');
    }catch(error){
        res.status(400).send(error);
    }
});

router.post('/users/logoutall', authMiddleware, async (req,res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send('Successfully logged out of all sessions!');
    }catch(error){
        res.status(500).send(error);
    }
});

//Route for creating new user
router.post('/users',async (req,res)=>{
    try{
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        sendWelcomeEmail(user.email, user.name);
        res.status(201).send({user,token});
    }catch(error){
        res.status(500).send(error);
    }
});


//Route for getting user data
router.get('/users/me', authMiddleware,async (req,res)=>{
    try{
       res.send(req.user);
    }catch(error){
        res.send(400).send(error);
    }
});

//Route for updating user data
router.patch('/users/me',authMiddleware, async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','password','age'];
    const isKeyUpdateValid = updates.every((curr)=>{
        return allowedUpdates.indexOf(curr) != -1;
    });

    if(!isKeyUpdateValid) return res.status(400).send({error:'invalid update parameters'});
    
    try{
        //instead of using findByIdAndUpdate, findById() and save() method was used so that the middleware for our User schema will fire.
            // const user = await User.findByIdAndUpdate(userId,req.body,{
            //     new: true,
            //     runValidators:true
            // });   
        updates.forEach((update)=> req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);

    }catch(error){
        res.status(400).send(error);
    }
});

//Route for deleting user document referenced by id
router.delete('/users/me', authMiddleware, async (req,res)=>{
    try{
        await req.user.deleteOne({_id:req.user._id});
        sendGoodByeEmail(req.user.email, req.user.name);
        res.send(req.user);
    }catch(error){
        res.status(500).send(error);
    }
});


module.exports = router;