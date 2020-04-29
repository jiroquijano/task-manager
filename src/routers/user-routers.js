const express = require('express');
const User = require('../models/user');

const router = new express.Router();


//get all users using mongoose method find({...query})
router.get('/users',async (req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(error){
        res.status(500).send(error);
    }
});

router.post('/users/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password); //user defined method in user schema
        const token = await user.generateAuthToken();
        res.send({user,token});
    }catch(error){
        res.status(400).send(error);
    }
});

//Route for creating new user
router.post('/users',async (req,res)=>{
    try{
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user,token});
    }catch(error){
        res.status(500).send(error);
    }
});


//Route for getting user data by ID
router.get('/users/:id',async (req,res)=>{
    const userId = req.params.id;
    try{
        const user = await User.findById(userId);
        if(!user) return res.status(404).send({error:'No user found'});
        res.send(user);
    }catch(error){
        res.send(400).send(error);
    }
});

//Route for updating user data
router.patch('/users/:id', async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','password','age'];
    const isKeyUpdateValid = updates.every((curr)=>{
        return allowedUpdates.indexOf(curr) != -1;
    });

    if(!isKeyUpdateValid) return res.status(400).send({error:'invalid update parameters'});
    
    try{
        const userId = req.params.id;
        //instead of using findByIdAndUpdate, findById() and save() method was used so that the middleware for our User schema will fire.
            // const user = await User.findByIdAndUpdate(userId,req.body,{
            //     new: true,
            //     runValidators:true
            // });
        const user = await User.findById(userId);
        updates.forEach((update)=> user[update] = req.body[update]);
        await user.save();

        if(!user) return res.status(404).send({error:`user with id: ${userId} not found`});
        res.send(user);
    }catch(error){
        res.status(400).send(error);
    }
});

//Route for deleting user document referenced by id
router.delete('/users/:id',async (req,res)=>{
    const userId = req.params.id;
    try{
        const user = await User.findByIdAndDelete(userId);
        if(!user) return res.status(404).send({error:`user with id: ${userId} not found!`});
        res.send(user);
    }catch(error){
        res.status(500).send(error);
    }
});


module.exports = router;