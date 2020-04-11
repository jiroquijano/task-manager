const mongoose = require('mongoose');
const validator = require('validator');

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
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(emailAddress){
            if (!validator.isEmail(emailAddress)){
                throw new Error('Please enter a valid email address');
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(passwordValue){
            if(passwordValue.includes('password')){
                throw new Error('Password must not contain "password"');
            }
        }
    }
});

// //create User instance jiro
// const jiro = new User({
//     name: "jiro",
//     age: 28,
//     email: "jiroquijano@gmail.com",
//     password: "Networklabs"
// });

// // commit/save it to mongodb
// jiro.save().then((data)=>{
//     console.log(data);
// }).catch((error)=>{
//     console.log(error)
// });

const Task = new mongoose.model('Task',{
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const doLaundryTask = new Task({
    description: 'Clean house'
});

doLaundryTask.save().then((resolved)=>{
    console.log(resolved);
}).catch((error)=>{
    console.log(error);
})