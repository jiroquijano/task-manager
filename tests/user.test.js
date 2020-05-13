const request = require('supertest');
const app = require('../src/index');
const User = require('../src/models/user');

const userFixture = {
    name: 'Bonna',
    email: 'bonnievillagen@gmail.com',
    password: 'Halikachik_038'
};

beforeEach( async ()=>{
    await User.deleteMany({});
    await new User(userFixture).save();
});

test('Should signup a new user', async()=>{
    await request(app).post('/users').send({
        name: 'Jiro',
        email: 'jiroquijano@gmail.com',
        password: 'Decipher_0731'
    }).expect(201);
});

test('Should log in existing user', async()=>{
    await request(app).post('/users/login').send(userFixture).expect(200);
});

test('Should prevent login when credentials not correct', async()=>{
    await request(app).post('/users/login').send({
        email: 'bonnievillagen@gmail.com',
        password: 'wrong_password'
    }).expect(400);
});