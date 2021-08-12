const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../index');

chai.should();

chai.use(chaiHttp);

describe('Tasks API', () => {
  describe('POST', () => {
    it('sjscn', (done) => {
      chai
        .request(app)
        .post('/api/v1/sms/single')
        .end((err, response) => {
          // if (err) return done(err);
          response.should.have.status(2000);
        });
      done();
    });
  });
});
