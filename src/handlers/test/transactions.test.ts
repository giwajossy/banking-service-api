import chai from 'chai'
import supertest from 'supertest'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import app from '../../app'
import UserModel from '../../models/user.model'
import TransactionModel from '../../models/transaction.model'
import { v4 as uuidv4 } from 'uuid';

const { expect } = chai
const request = supertest.agent(app)
const secret = process.env.SECRET as string


let newTransaction: any = {}
let testUser: any = {}



const transactionData = {
    sender: '62fbdccbcaaf70be72382b7d',
    type: 'deposit',
    recipient: '8cae7736-0f75-4ad2-abe2-dec4496756c2',
    amount: 10000
}




describe('TRANSACTIONS', () => {

    before(async () => {

        // Create database table for user and transaction

        newTransaction = await TransactionModel.create(transactionData)

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
        await TransactionModel.deleteMany({})
    })


    // Fund Wallet
    describe('POST /api/v1/transaction/fund_wallet/', () => {

        it('Should fund user\'s wallet', (done) => {
            const payload = {
                sender: `${testUser._id}`,
                type: 'deposit',
                recipient: `${testUser.wallet.address}`,
                amount: 1000000
            }
            request
                .post('/api/v1/transaction/fund_wallet')
                .set('authorization', `Bearer ${testUser.token}`)
                .send(payload)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.message).to.be.equal('Operation successful')
                    expect(res.body.success).to.be.equal(true)
                    expect(res.body.data).to.be.an('object')
                    done()
                })
        })
    })



    // Withdraw Funds
    describe('POST /api/v1/transaction/withdraw_funds/', () => {

        it('Should successfully withdraw from user\'s account', (done) => {
            const payload = {
                sender: `${testUser._id}`,
                type: 'withdraw',
                recipient: `${testUser.wallet.address}`,
                amount: 10
            }
            request
                .post('/api/v1/transaction/withdraw_funds')
                .set('authorization', `Bearer ${testUser.token}`)
                .send(payload)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.success).to.be.equal(true)
                    expect(res.body.message).to.be.equal('Operation successful')
                    expect(res.body.data).to.be.an('object')
                    done()
                })
        })
    })




    // Transfer Funds
    describe('POST /api/v1/transaction/transafer_funds/', () => {

        it('Should successfully transfer funds to another user', (done) => {
            const payload = {
                sender: `${testUser._id}`,
                type: 'transfer',
                recipient: `${testUser.wallet.address}`,
                amount: 10
            }
            request
                .post('/api/v1/transaction/transafer_funds')
                .set('authorization', `Bearer ${testUser.token}`)
                .send(payload)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.success).to.be.equal(true)
                    expect(res.body.message).to.be.equal('Operation successful')
                    expect(res.body.data).to.be.an('object')
                    done()
                })
        })


        it('Should return recipient not found', (done) => {
            const payload = {
                sender: `${testUser._id}`,
                type: 'transfer',
                recipient: 'somerandomfakewalletaddress',
                amount: 10
            }
            request
                .post('/api/v1/transaction/transafer_funds')
                .set('authorization', `Bearer ${testUser.token}`)
                .send(payload)
                .end((err, res) => {
                    expect(res.status).to.be.equal(404)
                    expect(res.body.success).to.be.equal(false)
                    expect(res.body.message).to.be.equal('Recipient not found')
                    done()
                })
        })
    })




    // Get transaction history
    describe('GET /api/v1/transaction/transaction_history/', () => {

        it('Should get transaction history', (done) => {
            request
                .get('/api/v1/transaction/transaction_history')
                .set('authorization', `Bearer ${testUser.token}`)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body.success).to.be.equal(true)
                    expect(res.body.message).to.be.equal('Operation successful')
                    expect(res.body.data).to.be.an('array')
                    done()
                })
        });
        
    })






})