const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/index');
const User = require('../src/models/user');

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

beforeEach( async ()=>{
    await User.deleteMany({});
    await new User(userFixture).save();
});

test('Should signup a new user', async()=>{
    await request(app).post('/users').send({
        name: 'Jiro',
        email: 'jirodummyacct@gmail.com',
        password: 'Decipher_0731'
    }).expect(201);
});

test('Should log in existing user', async()=>{
    await request(app).post('/users/login').send({
        email: userFixture.email,
        password: userFixture.password
    }).expect(200);
});

test('Should prevent login when credentials not correct', async()=>{
    await request(app).post('/users/login')
        .send({
            email: 'bonnievillagen@gmail.com',
            password: 'wrong_password'
        }).expect(400);
});

test('Should get profile for user', async()=>{
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${userFixture.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not be able to view profile when token is wrong', async()=>{
    await request(app).get('/users/me')
        .set('Authorization', `Bearer blablablabla`)
        .expect(401)
        .send()
});

test('Should be able to delete account', async()=>{
    await request(app).delete('/users/me')
        .set('Authorization', `Bearer ${userFixture.tokens[0].token}`)
        .expect(200)
        .send() 
});

test('Should not be able to delete account of others', async()=>{
    await request(app).delete('/users/me')
        .set('Authorization', 'Bearer blablablablaba')
        .expect(401)
        .send()
});