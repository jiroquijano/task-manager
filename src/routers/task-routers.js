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

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=0 --- limit is items per page, skip is... pages skipped
router.get('/tasks', authMiddleware, async (req,res)=>{
    const match = {};

    if(req.query.completed){
        match.completed = req.query.completed === 'true';
    }

    try{
        await req.user.populate({ //populates virtual field tasks with conditions in 'match'
            path: 'tasks',
            match,
            options: { //mongoose option includes limit for pagination
                limit: parseInt(req.query.limit), //NaN is ignored by mongoose, so if limit is not defined, all tasks will be displayed
                skip: parseInt(req.query.skip)
            }
        }).execPopulate();
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

router.patch('/tasks/:id', authMiddleware, async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','completed'];
    const isUpdateAllowed = updates.every((curr)=>{
        return allowedUpdates.includes(curr);
    });

    if(!isUpdateAllowed) return res.status(400).send({error:'Update contains invalid keys!'});
    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        if(!task) return res.status(404).send({error:`Task with id: ${req.params.id} not found for user!`});
        updates.forEach((update)=>{
            task[update] = req.body[update];
        });
        await task.save();
        res.send(task);
    }catch(error){
        res.status(400).send(error);
    }

});

router.delete('/tasks/:id',authMiddleware, async (req,res)=>{
    try{
        const taskId = req.params.id;
        const task = await Task.findOneAndDelete({_id:taskId, owner: req.user._id})
        if(!task) return res.status(404).send({error:`Task with id: ${taskId} not found!`});
        res.send(task);
    }catch(error){
        res.status(500).send(error);
    }
});

module.exports = router;