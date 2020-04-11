const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex: true
});

//create mongoose model for user with {name,age}
//mongoose.model(<collection name>, {<document structure and options>})
const User = mongoose.model('User', {
    name:{
        type: String,
        required: true
    },
    age: {
        type: Number,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    }
});

//create User instance jiro
const jiro = new User({
    name: "jiro",
    age: 28
});

// commit/save it to mongodb
jiro.save().then((data)=>{
    console.log(data);
}).catch((error)=>{
    console.log(error)
});

// const Task = new mongoose.model('Task',{
//     description: {
//         type: String,
//         required: true
//     },
//     completed: {
//         type: Boolean
//     }
// });

// const doLaundryTask = new Task({
//     description: 'Do Laundry',
//     completed: false
// });

// doLaundryTask.save().then((resolved)=>{
//     console.log(resolved);
// }).catch((error)=>{
//     console.log(error);
// })