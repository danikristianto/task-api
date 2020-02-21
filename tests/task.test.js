const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOneId, userOne, userTwoId, userTwo, taskOne, taskTwo, taskThree, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'from my test'
        })
        .expect(201)
    
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should not create task with invalid description/completed', async () => {
    await request(app)
        .post('/tasks')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: true
        })
        .expect(400)
})

test('Should fetch user tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should fetch only completed tasks', async () => {
    const response = await request(app)
        .get('/tasks?completed=true')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body).not.toBeNull()
})

test('Should fetch only incomplete tasks', async () => {
    const response = await request(app)
        .get('/tasks?completed=false')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .expect(200)
    
    expect(response.body.length).not.toBeNull()
})

test('Should fetch user tasks by id', async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

test('Should not fetch other users task by id', async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

test('Should not fetch user task by id if unauthenticated', async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

test('Should update task', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: true
        })
        .expect(200)
    
    const task = await Task.findById(taskOne._id)
    expect(task.completed).toEqual(true)
})

test('Should not update other user task', async () => {
    await request(app)
        .patch(`/tasks/${taskTwo._id}`)
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: true
        })
        .expect(200)
})

test('Should not update task with invalid description/completed', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: 'boolean'
        })
        .expect(400)
    
    const task = await Task.findById(taskOne._id)
    expect(task.completed).toEqual(false)
})

test('Should delete user task', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .expect(200)
    
    const task = await Task.findById(taskOne._id)
    expect(task).toBeNull()
})

test('Should not delete other user task', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

test('Should not delete unauthenticated task', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)
})

test("Should sort tasks by description/completed/createdAt/updatedAt", async () => {
    const response = await request(app)
        .get("/tasks?sortBy=createdAt:desc")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
        
        expect(response.body[0]._id).toEqual(taskTwo._id.toString())
})

test("Should fetch page of tasks", async () => {
    const response = await request(app)
        .get("/tasks?limit=2&skip=4")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

        expect(response.body.length).not.toBeNull()
})