const express = require('express');
const userRouter = require('./routers/user-routers');
const taskRouter = require('./routers/task-routers');
require('./db/mongoose');
const app = express();
const port = process.env.PORT;

app.use(express.json()); //configure express to parse incoming json files
app.use(userRouter);
app.use(taskRouter);

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});