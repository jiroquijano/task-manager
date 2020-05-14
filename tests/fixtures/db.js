const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

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

module.exports = {
    userFixture,
    userFixtureId
}