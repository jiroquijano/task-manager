const express = require('express');
const User = require('./models/user');
const Task = require('./models/task');
require('./db/mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); //configure express to parse incoming json files

app.post('/users',(req,res)=>{
    const user = new User(req.body);
    user.save().then((data)=>{
        res.status(201).send(data);
    }).catch((error)=>{
        res.status(400).send(error);
    });
});

app.post('/tasks',(req,res)=>{
    const task = new Task(req.body);
    task.save().then((data)=>{
        res.status(201).send(data);
    }).catch((error)=>{
        res.status(400).send(error);
    });
});

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});