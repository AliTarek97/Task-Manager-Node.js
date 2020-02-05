const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');

//created it as a standalone variable because  
//I'm going to use it into two places
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id:userOneId,
    name:'mike',
    email:'mike@example.com',
    password:'56what!!',
    tokens:[{
        token: jwt.sign({_id: userOneId} , process.env.JWT_SECRET)
    }]
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

test('Should get profile for user' , async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user' , async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user' , async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not delete account for unauthenticated user' , async () =>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})