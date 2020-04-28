const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
        validate(emailAddress){ //validate mongoose middleware 
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

//setup before 'save' event middleware for hashing password using bcrypt. 
//2nd parameter should be normal function because arrow function does not do 'this' bindings.
userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){ //mongoose method for checking if the field was modified
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
});

//create mongoose model for user with {name,age,email,password}
//mongoose.model(<collection name>, schema)
const User = mongoose.model('User', userSchema);

module.exports = User;