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

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});