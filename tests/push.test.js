const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../index');

chai.should();

chai.use(chaiHttp);

describe('Push notification API', () => {
  // If empty data passes
  describe('POST', () => {
    it('If empty data passes', (done) => {
      chai
        .request(app)
        .post('/api/v1/push-notification/single/v2')
        .end((err, response) => {
          response.should.have.status(400);
        });
      done();
    });
  });

  // If full data passes
  describe('POST', () => {
    it('If Full data passes', (done) => {
      chai
        .request(app)
        .post('/api/v1/push-notification/single/v2')
        .send({
          title: 'notification title',
          body: 'push notification body',
          deviceId: 'ABCDESFGAH',
        })
        .end((err, response) => {
          response.should.have.status(200);
          response.should.have.be.a('object');
        });
      done();
    });
  });
});
