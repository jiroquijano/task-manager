const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userFixtureId = new mongoose.Types.ObjectId();
const userFixture = {
    _id: userFixtureId,
    name: 'Bonna',
    email: 'bonniedummyacct@gmaildummy.com',
    password: 'Halikachik_038',
    tokens: [{
        token: jwt.sign({_id: userFixtureId}, process.env.USER_TOKEN_SECRET)
    }]
};

const otherUserFixtureId = new mongoose.Types.ObjectId();
const otherUserFixture = {
    _id: otherUserFixtureId,
    name: 'Jiro',
    email: 'jirodummyacct@gmaildummy.com',
    password: 'Halikachik_038',
    tokens: [{
        token: jwt.sign({_id: otherUserFixtureId}, process.env.USER_TOKEN_SECRET)
    }]
};

const taskFixtureOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "Pray the Rosary",
    owner: userFixtureId
}

const taskFixtureTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Exercise",
    completed: true,
    owner: userFixtureId
}

const taskFixtureThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "new Task",
    completed: true,
    owner: otherUserFixtureId
}

const setupDatabase = async()=>{
    await User.deleteMany({});
    await Task.deleteMany({});
    await new User(userFixture).save();
    await new User(otherUserFixture).save();
    await new Task(taskFixtureOne).save();
    await new Task(taskFixtureTwo).save();
    await new Task(taskFixtureThree).save();
};

module.exports = {
    userFixture,
    userFixtureId,
    otherUserFixture,
    setupDatabase
}