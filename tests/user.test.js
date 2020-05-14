const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/index');
const User = require('../src/models/user');
const {userFixture, userFixtureId} = require('../tests/fixtures/db');

beforeEach( async ()=>{ //jest function which is being run before every test is executed
    await User.deleteMany({});
    await new User(userFixture).save();
});

test('Should signup a new user', async()=>{
    const response = await request(app).post('/users').send({
        name: 'Jiro',
        email: 'jirodummyacct@gmail.com',
        password: 'Decipher_0731'
    }).expect(201);

    //assert that the response body's user has id
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    //compares expectation to an object
    expect(response.body).toMatchObject({
        user:{
            name: 'Jiro',
            email: 'jirodummyacct@gmail.com'
        },
        token: user.tokens[0].token
    });

    //checks if password became hashed (kind of)
    expect(user.password).not.toBe('Decipher_0731');

});

test('Should log in existing user', async()=>{
    const response = await request(app).post('/users/login').send({
        email: userFixture.email,
        password: userFixture.password
    }).expect(200);

    const userFromDB = await User.findById(userFixtureId);
    expect(response.body).toMatchObject({ //jest method to compare the entity being tested to an object
        user:{
            name: userFixture.name,
            email: userFixture.email
        },
        token: userFromDB.tokens[1].token
    });

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
        .send();
});

test('Should be able to delete account', async()=>{
    const response = await request(app).delete('/users/me')
        .set('Authorization', `Bearer ${userFixture.tokens[0].token}`)
        .expect(200)
        .send();
    
    const deletedUser = await User.findById(response.body._id);
    expect(deletedUser).toBeNull();
});

test('Should not be able to delete account of others', async()=>{
    await request(app).delete('/users/me')
        .set('Authorization', 'Bearer blablablablaba')
        .expect(401)
        .send();
});

test('Should upload avatar image', async()=>{
    await request(app).post('/users/me/avatar')
    .set('Authorization', `Bearer ${userFixture.tokens[0].token}`) //for setting up post header's 'Authorization' param
    .attach('avatar','tests/fixtures/profile-pic.jpg') //used for setting up post for attaching file
    .expect(200);

    const user = await User.findById(userFixtureId);
    expect(user.avatar).toEqual(expect.any(Buffer));

});

test('Should be able to update valid fields', async()=>{
    const response = await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${userFixture.tokens[0].token}`)
        .send({
            name: 'Bonnie'
        })
        .expect(200);
    expect(response.body.name).toBe('Bonnie');
});

test('Should not update invalid fields', async()=>{
    await request(app).patch('/users/me')
        .set('Authorization',  `Bearer ${userFixture.tokens[0].token}`)
        .send({
            invalidField: 'update'
        })
        .expect(400);
});