const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should sign up new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Dani',
            email: 'danikristianto@student.uns.ac.id',
            password: 'Red12345'
        }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Dani',
            email:'danikristianto@student.uns.ac.id'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Red12345')
})

test('Should not sign up new user', async () => {
    await request(app)
        .post('/users')
        .send({
            name: 'Dani',
            email: 'danikristianto@',
            password: 'Red12345'
        }).expect(400)
})

test('Should login existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        }).expect(200)
    
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'password'
        }).expect(400)
})

test('Should get profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()

})

test('Should not delete unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'DaniKris'
        })
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('DaniKris')
})

test('Should not update invalid user', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            email: 'zzdota8@gmail.com'
        })
        .expect(200)
})

test('Should not update unauthenticated user', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            name: 'DaniKris'
        })
        .expect(401)
})