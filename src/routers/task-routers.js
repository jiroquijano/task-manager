const express = require('express');
const Task = require('../models/task');
const authMiddleware = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', authMiddleware, async (req,res)=>{
    try{
        const newTask = new Task({
            ...req.body,
            owner: req.user._id
        });
        await newTask.save();
        res.status(201).send(newTask);
    }catch(error){
        res.status(500).send(error);
    }
});

router.get('/tasks', authMiddleware, async (req,res)=>{
    try{
        //const results = await Task.find({owner: req.user._id});
        // res.send(results);
        await req.user.populate('tasks').execPopulate(); //return tasks by populating virtual tasks of User
        res.send(req.user.tasks);
    }catch(error){
        res.status(500).send();
    }

});

router.get('/tasks/:id', authMiddleware, async (req,res)=>{
    const taskId = req.params.id;
    try{
        const task = await Task.findOne({_id: taskId, owner: req.user._id});
        if(!task) return res.status(404).send();
        res.send(task);
    }catch(error){
        res.status(404).send(error);
    }

});

router.patch('/tasks/:id', async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','completed'];
    const isUpdateAllowed = updates.every((curr)=>{
        return allowedUpdates.includes(curr);
    });

    if(!isUpdateAllowed) return res.status(400).send({error:'Update contains invalid keys!'});
    try{
        const task = await Task.findById(req.params.id);
        updates.forEach((update)=>{
            task[update] = req.body[update];
        });
        await task.save();
        if(!task) return res.status(404).send({error:`Task with id: ${req.params.id} not found!`});
        res.send(task);
    }catch(error){
        res.status(400).send(error);
    }

});

router.delete('/tasks/:id', async (req,res)=>{
    try{
        const taskId = req.params.id;
        const task = await Task.findByIdAndDelete(taskId);
        if(!task) return res.status(404).send({error:`Task with id: ${taskId} not found!`});
        res.send(task);
    }catch(error){
        res.status(500).send(error);
    }
});

module.exports = router;