const request = require('supertest');
const Task = require('../src/models/task');
const User = require('../src/models/user');
const app = require('../src/index');
const {userFixture, userFixtureId, otherUserFixture, setupDatabase} = require('../tests/fixtures/db');

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
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false);
});

test('Should be able to fetch all tasks by user', async()=>{
    const response = await request(app).get('/tasks')
        .set('Authorization', `Bearer ${userFixture.tokens[0].token}`)
        .expect(200)
        .send();
    expect(response.body.length).toBe(2);
});

test('Should not be able to delete task of other users', async()=>{
    const task = await Task.findOne({description: "Pray the Rosary"});
    await request(app).delete(`/tasks/${task._id}`)
        .set('Authorization', `Bearer ${otherUserFixture.tokens[0].token}`)
        .expect(404)
        .send();
    const checkTaskAgain = await Task.findById(task._id);
    expect(checkTaskAgain).not.toBeNull();
});