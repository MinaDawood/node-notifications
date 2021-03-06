const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../index');

chai.should();

chai.use(chaiHttp);

describe('SMS API', () => {
  // If empty data passes
  describe('POST', () => {
    it('If empty data passes', (done) => {
      chai
        .request(app)
        .post('/api/v1/sms/single')
        .end((err, response) => {
          response.should.have.status(400);
        });
      done();
    });
  });

  // If full data passes but not a vaild or registered number
  describe('POST', () => {
    it('If Full data passes but not vaild or registered', (done) => {
      chai
        .request(app)
        .post('/api/v1/sms/single')
        .send({
          message: 'test message', // Put message here
          phoneNumber: '+2', // Put phone number here
        })
        .end((err, response) => {
          response.should.have.status(400);
        });
      done();
    });
  });
});
