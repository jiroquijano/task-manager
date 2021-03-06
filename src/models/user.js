const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

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
        unique: true,
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
    },
    tokens: [{
        token:{
            type:String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

userSchema.virtual('tasks',{ //not saved in MongoDB but serves as a reference to Mongoose about schema relations
    ref: 'Task',            //reference to Task schema
    localField: '_id',      //field on current schema
    foreignField: 'owner'   //field on referenced schema
});

//setup before 'save' event. Middleware for hashing password using bcrypt. 
//2nd parameter should be normal function because arrow function does not do 'this' bindings.
//pre hooks only apply to user instances, not for the whole Schema
userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){ //mongoose method for checking if the field was modified
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
});

//pre hook middleware to delete tasks under user before deleting the user
//option {document:true} is set so that the prehook applies to the document instead of Query
userSchema.pre('deleteOne',{document: true}, async function (next){
    const user = this;
    await Task.deleteMany({ owner: user._id});
    next();
});

//.methods are available for the model instances
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = await jwt.sign({_id: user.id.toString()},process.env.USER_TOKEN_SECRET);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
};

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}

//.statics are accessible for the Model itself
userSchema.statics.findByCredentials = async(email, password) =>{
    const user = await User.findOne({email});
    if(!user) throw new Error('unable to log in');
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) throw new Error('unable to log in!');
    return user;
};

//create mongoose model for user with {name,age,email,password}
//mongoose.model(<collection name>, schema)
const User = mongoose.model('User', userSchema);

module.exports = User;