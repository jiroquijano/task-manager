const express = require('express');
const userRouter = require('./routers/user-routers');
const taskRouter = require('./routers/task-routers');
require('./db/mongoose');
const app = express();

app.use(express.json()); //configure express to parse incoming json files
app.use(userRouter);
app.use(taskRouter);
app.get('/',(req,res)=>{
    res.send(`This application is currently only accepting POSTMAN requests. Frontend component to follow after I learn React :)`);
});

module.exports = app;