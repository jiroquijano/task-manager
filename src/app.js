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

//get all users using mongoose method find()
app.get('/users', (req,res)=>{
    User.find({}).then((users)=>{
        res.status(200).send(users);
    }).catch((error)=>{
        res.status(500).send();
    });
});

//'route parameter' id under users route.
app.get('/users/:id',(req,res)=>{
    const idQuery = req.params.id;
    User.findById(idQuery).then((user)=>{
        if(!user) return res.status(404).send();
        res.status(200).send(user);
    }).catch((error)=>{
        res.status(400).send(error);
    })
});

app.get('/tasks',(req,res)=>{
    Task.find({}).then((tasks)=>{
        res.send(tasks);
    }).catch((error)=>{
        res.status(500).send();
    });
});

app.get('/tasks/:id',(req,res)=>{
    const taskId = req.params.id;
    Task.findById(taskId).then((task)=>{
        if(!task) return res.status(404).send();
        res.send(task);
    }).catch((error)=>{
        res.status(500).send();
    });
});

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});