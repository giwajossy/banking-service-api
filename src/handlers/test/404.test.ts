import chai from 'chai'
import supertest from 'supertest'
import app from '../../app'

const { expect } = chai
const request = supertest.agent(app)

describe('Handle Invalid Routes', () => {

  describe('GET /*', () => {

    it('should handle invalid routes', (done) => {
      request
        .get('/*')
        .expect(404)
        .end((err, res) => {
          expect(res.status).to.be.equal(404)
          expect(res.body).to.be.an('object')
          expect(res.body.success).to.be.equal(false)
          expect(res.body.message).to.be.equal('Invalid Route. Please confirm your endpoint.')
          done()
        })
    })

  })  



})