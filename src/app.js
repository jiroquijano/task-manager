const express = require('express');
require('./db/mongoose');
const User = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); //configure express to parse incoming json files

app.post('/users',(req,res)=>{
    const user = new User(req.body);
    user.save().then((data)=>{
        return res.send(data);
    }).catch((error)=>{
        return res.send(error);
    });
});

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});