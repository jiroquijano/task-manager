const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userFixtureId = new mongoose.Types.ObjectId();
const userFixture = {
    _id: userFixtureId,
    name: 'Bonna',
    email: 'bonniedummyacct@gmail.com',
    password: 'Halikachik_038',
    tokens: [{
        token: jwt.sign({_id: userFixtureId}, process.env.USER_TOKEN_SECRET)
    }]
};

const setupDatabase = async()=>{
    await User.deleteMany({});
    await Task.deleteMany({});
    await new User(userFixture).save();
};

module.exports = {
    userFixture,
    userFixtureId,
    setupDatabase
}