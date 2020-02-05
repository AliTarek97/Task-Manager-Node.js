const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const userOne = {
    name:'mike',
    email:'mike@example.com',
    password:'56what!!'
}

beforeEach(async ()=>{
    await User.deleteMany();
    // the create user test case will pass because emails don't conflict
    await new User(userOne).save();
})

test('Should signup a new user' , async () => {
    await request(app).post('/users').send({
        name: 'Ali',
        email: 'ali.tarek.mahmoud@gmail.com',
        password: 'MyPass777!'
    }).expect(201)
})

test('Should login existing user' , async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email:userOne.email,
        password:'password'
    }).expect(400)
})