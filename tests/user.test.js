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
    const response = await request(app).post('/users').send({
        name: 'andrew',
        email: 'andrew@example.com',
        password: 'MyPass777!'
    }).expect(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    //Assertions about the response
    expect(response.body).toMatchObject({
        user:{
            name:'andrew',
            email:'andrew@example.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('MyPass777!');
})

test('Should login existing user' , async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token)
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
    const user = User.findById(userOneId);
    expect(user).not.toBeNull();
})

test('Should not delete account for unauthenticated user' , async () =>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image' , async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar' , 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
})

test('Should update valid user fields' , async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'jess'
        })
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.name).toEqual('jess'); 
})

test('Should not update invalid user fields' , async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Philadelphia'
        })
        .expect(400); 
})