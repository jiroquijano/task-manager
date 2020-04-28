const express = require('express');
const Task = require('../models/task');

const router = new express.Router();

router.post('/tasks',async (req,res)=>{
    try{
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).send(newTask);
    }catch(error){
        res.status(500).send(error);
    }
});

router.get('/tasks', async (req,res)=>{
    try{
        const results = await Task.find({});
        res.send(results);
    }catch(error){
        res.status(500).send();
    }

});

router.get('/tasks/:id',async (req,res)=>{
    const taskId = req.params.id;
    try{
        const task = await Task.findById(taskId);
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
        task.save();
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