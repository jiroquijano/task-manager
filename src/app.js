const express = require('express');
const User = require('./models/user');
const Task = require('./models/task');
require('./db/mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); //configure express to parse incoming json files

app.post('/users',async (req,res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        res.send(user);
    }catch(error){
        res.status(400).send(error);
    }
});

app.post('/tasks',async (req,res)=>{
    try{
        const newTask = new Task(req.body);
        await newTask.save();
        res.send(newTask);
    }catch(error){
        res.status(500).send(error);
    }
});

//get all users using mongoose method find({...query})
app.get('/users', async (req,res)=>{
    try{
        const result = await User.find({});
        res.send(result);
    }catch(error){
        res.status(500).send(error);
    }
});

//'route parameter' id under users route.
app.get('/users/:id', async (req,res)=>{
    const idQuery = req.params.id;
    try{
        const result = await User.findById(idQuery);
        if(!result) return res.status(404).send();
        res.send(result);
    }catch(error){
        res.status(400).send(error);
    }
});

app.get('/tasks', async (req,res)=>{
    try{
        const results = await Task.find({});
        res.send(results);
    }catch(error){
        res.status(500).send();
    }

});

app.get('/tasks/:id',async (req,res)=>{
    const taskId = req.params.id;
    try{
        const task = await Task.findById(taskId);
        if(!task) return res.status(404).send();
        res.send(task);
    }catch(error){
        res.status(404).send(error);
    }

});

app.patch('/users/:id', async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','password','age'];

    const isKeyUpdateValid = updates.every((curr)=>{
        return allowedUpdates.indexOf(curr) != -1;
    });

    if(!isKeyUpdateValid){
        return res.status(400).send({error:'Requested key update not allowed!'});
    }

    try{
        const idQuery = req.params.id;
        const user = await User.findByIdAndUpdate(idQuery,req.body,{
            new: true, //returns the updated entry instead of original
            runValidators: true //validate update using validators
        });
        if(!user) res.status(404).send();
        res.send(user);
    }catch(error){
        res.status(400).send(error);
    }
});

app.patch('/tasks/:id', async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','completed'];
    const isUpdateAllowed = updates.every((curr)=>{
        return allowedUpdates.includes(curr);
    });

    if(!isUpdateAllowed) return res.status(400).send({error:'Update contains invalid keys!'});
    try{
        const task = await Task.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true
        });
        if(!task) return res.status(404).send({error:`Task with id: ${req.params.id} not found!`});
        res.send(task);
    }catch(error){
        res.send(400).send(error);
    }

});

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});