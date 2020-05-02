const express = require('express');
const userRouter = require('./routers/user-routers');
const taskRouter = require('./routers/task-routers');
require('./db/mongoose');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); //configure express to parse incoming json files
app.use(userRouter);
app.use(taskRouter);

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});

const Task = require('./models/task');
const User = require('./models/user');

const main = async()=>{
    const user = await User.findById('5ead52eb6ba43b8ba93e5d71');
    await user.populate('tasks').execPopulate();
    console.log(user.tasks);
}

main();