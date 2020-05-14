const request = require('supertest');
const Task = require('../src/models/task');
const User = require('../src/models/user');
const app = require('../src/index');
const {userFixture, userFixtureId, setupDatabase} = require('../tests/fixtures/db');

beforeEach( async ()=>{ //jest function which is being run before every test is executed
    await setupDatabase();
});

test('Should create task for user', async ()=>{
    const response = await request(app).post('/tasks')
        .set('Authorization', `Bearer ${userFixture.tokens[0].token}`)
        .send({
            description: "Cook dinner",
            completed: false
        })
        .expect(201);
    expect(response.body).toMatchObject({
        description: "Cook dinner",
        completed: false
    });  
});