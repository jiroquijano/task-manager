const express = require('express');
const userRouter = require('./routers/user-routers');
const taskRouter = require('./routers/task-routers');
const app = require('./index');
const port = process.env.PORT;

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});