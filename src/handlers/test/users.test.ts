import chai from 'chai'
import supertest from 'supertest'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import app from '../../app'
import UserModel from '../../models/user.model'
import { v4 as uuidv4 } from 'uuid';

const { expect } = chai
const request = supertest.agent(app)
const secret = process.env.SECRET as string

let testUser: any = {}

describe('USERS', () => {

    before(async () => {
        
        // Create database table
        let password = 'test123'
        testUser = await UserModel.create({
            name: 'John Doe',
            email: 'John@example.com',
            hash: bcrypt.hashSync(password, 8),
            wallet: { address: uuidv4() }
        })

        testUser.token = jwt.sign(
            {
                id: testUser.id,
                name: testUser.name,
                email: testUser.email
            },
            secret
        )
    })

    after(async () => {
        // Empty the database
        await UserModel.deleteMany({})
    })


    // Create account
    describe('POST /api/v1/auth/register', () => {
        it('Should create new user', (done) => {
            const newUser = {
                name: 'Jane',
                email: 'Jane@gmail.com',
                password: 'jane'
            }
            request
                .post('/api/v1/auth/register')
                .send(newUser)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.success).to.be.equal(true)
                    expect(res.body.message).be.equal('Sign Up successful!')
                    expect(res.body.data).to.be.an('object')
                    done()
                })
        })

        it('Should return \'Email Invalid\'', (done) => {
            const testInvalidEmail = {
                name: 'Jane',
                email: 'Janegmail.com',
                password: 'jane'
            }
            request
                .post('/api/v1/auth/register')
                .send(testInvalidEmail)
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.message).be.equal('Email Invalid')
                    done()
                })
        })


        it('Should return \'User Already Exists\'', (done) => {
            const testInvalidEmail = {
                name: 'Jane',
                email: 'John@example.com',
                password: 'jane'
            }
            request
                .post('/api/v1/auth/register')
                .send(testInvalidEmail)
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.message).be.equal('User Already Exists')
                    done()
                })
        })

    })


    // Sign-In User
    describe('POST /api/v1/auth/signin', () => {

        it('Should signin a new user', (done) => {
            const loginDetails = {
                email: 'Jane@gmail.com',
                password: 'jane'
            }
            request
                .post('/api/v1/auth/signin')
                .send(loginDetails)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.success).to.be.equal(true)
                    expect(res.body.message).be.equal('Sign in Successful')
                    expect(res.body.data).to.be.an('object')
                    done()
                })
        })


        it('Should return \'Invalid Password\'', (done) => {
            const testInvalidPassword = {
                email: 'John@example.com',
                password: 'ja'
            }
            request
                .post('/api/v1/auth/signin')
                .send(testInvalidPassword)
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.message).be.equal('Invalid Password')
                    done()
                })
        })

        it('Should return \'Email or password incorrect\'', (done) => {
            const testInvalidEmail = {
                email: 'John@example.comm',
                password: 'test123'
            }
            request
                .post('/api/v1/auth/signin')
                .send(testInvalidEmail)
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.message).be.equal('Email or password incorrect')
                    done()
                })
        })

    })


    // Reset Password
    describe('PATCH /api/v1/auth/resetpassword/', () => {
        
        it('Should return This user doesn\'t exist', (done) => {
            const unrecognizedEmail = {
                email: 'John@example.comx',
                newPassword: 'test123',
                confirmNewPassword: 'test123'
            }
            request
                .patch('/api/v1/auth/resetpassword')
                .send(unrecognizedEmail)
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.message).to.be.equal('This user doesn\'t exist')
                    expect(res.body.success).to.be.equal(false)
                    done()
                })
        })


        it('Should return \'Passwords do not match\'', (done) => {
            const testPasswordMismatch = {
                email: 'John@example.com',
                newPassword: 'test1234',
                confirmNewPassword: 'test123'
            }
            request
                .patch('/api/v1/auth/resetpassword')
                .send(testPasswordMismatch)
                .end((err, res) => {
                    expect(res.status).to.be.equal(400)
                    expect(res.body.message).to.be.equal('Passwords do not match')
                    done()
                })
        })


        it('Should return \'Password Changed \'', (done) => {
            const validCredentials = {
                email: 'John@example.com',
                newPassword: 'test1234',
                confirmNewPassword: 'test1234'
            }
            request
                .patch('/api/v1/auth/resetpassword')
                .send(validCredentials)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.message).to.be.equal('Password Changed')
                    expect(res.body.success).to.be.equal(true)
                    done()
                })
        })

        
    })
    
    

    // Get All Users
    describe('GET /api/v1/users/', () => {
        it('Should get all users', (done) => {
            request
                .get('/api/v1/users')
                .set('authorization', `Bearer ${testUser.token}`)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body.success).to.be.equal(true)
                    expect(res.body.data).to.be.an('array')
                    done()
                })
        })
    })



    // Get a specific User
    describe('GET /api/v1/users/:id', () => {
        it('Should get a specific user', (done) => {
            request
                .get(`/api/v1/users/${testUser._id}`)
                .set('authorization', `Bearer ${testUser.token}`)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body.success).to.be.equal(true)
                    expect(res.body.data).to.be.an('object')
                    done()
                })
        })
    })



    // Delete a User
    describe('DELETE /api/v1/users/:id', () => {
        
        it('Should return \'This user doesn\'t exist if user is not found', (done) => {
            request
                .delete(`/api/v1/users/werwre34wew`)
                .set('authorization', `Bearer ${testUser.token}`)
                .end((err, res) => {
                    expect(res.status).to.be.equal(404)
                    expect(res.body).to.be.an('object')
                    expect(res.body.success).to.be.equal(false)
                    done()
                })
        })
        
        it('Should delete a user', (done) => {
            request
                .delete(`/api/v1/users/${testUser._id}`)
                .set('authorization', `Bearer ${testUser.token}`)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body.success).to.be.equal(true)
                    expect(res.body.message).to.be.equal('Successfully deleted')
                    done()
                })
        })
    })



})
