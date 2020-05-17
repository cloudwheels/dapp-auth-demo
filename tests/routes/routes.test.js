//const esmImport = require('esm')(module);
const path = require('path');
const debug = require('debug')('server:debug');

const supertest = require('supertest');
//const app = esmImport('../../app/app'); //import as ES6 module using esm
const app = require('../../app/app');
const request = supertest(app);

const session = require('supertest-session');

let requestWithSession;

beforeAll(function () {
  requestWithSession = session(app);
});

describe('Get currently set .env variables', () => {
  it('SERVER_PORT is set', async () => {
    expect(process.env.SERVER_PORT).toBeDefined();
    expect(process.env.SERVER_PORT).toBe('8082');
  });

  /*
  it('REDIS_HOST is set', async () => {
    expect(process.env.REDIS_HOST).toBeDefined();
    expect(process.env.REDIS_HOST).toBe(
      'redis-18005.c93.us-east-1-3.ec2.cloud.redislabs.com',
    );
  });
  it('REDIS_HOST is set', async () => {
    expect(process.env.REDIS_PORT).toBeDefined();
    expect(process.env.REDIS_PORT).toBe('18005');
  });
  */
});

describe('Session', () => {
  it('should be a session', async (done) => {
    const response = await request.get('/');
    debug(`requestWithSession ${requestWithSession}`);
    expect(requestWithSession).toBeDefined();

    done();
  });
  it('should redirect to login page', async (done) => {
    const response = await requestWithSession.get('/auth/home');

    expect(response.status).toBe(302);
    done();
  });

  it('should sign in', async (done) => {
    const response = await requestWithSession.get(
      '/user/cloudexplorer/login',
    );
    //.send({ user: 'foo' });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    done();
  }, 10000);

  it('should be welcomed to the user home page', async (done) => {
    const response = await requestWithSession.get('/auth/home');
    debug(`requestWithSession ${JSON.stringify(requestWithSession)}`);
    expect(response.status).toBe(200);
    expect(response.body.welcome).toBe('foo');
    var sessionCookie = requestWithSession.cookies.find(function (
      cookie,
    ) {
      return cookie.name === 'user';
    });
    debug(`user cookie : ${sessionCookie}`);

    done();
  });
});

describe('Invalid route', () => {
  it('should send a custom 404', async (done) => {
    const response = await request.get('/missing');

    expect(response.status).toBe(404);
    expect(response.type).toBe('text/html');
    expect(response.text).toBe('Page Not Found');
    done();
  });
});

describe('Static files', () => {
  it('should get a custom 404 page from the /views directory', async (done) => {
    const response = await request.get('/404.html');

    expect(response.status).toBe(200);
    expect(response.type).toBe('text/html');
    //expect(response.text).toInclude('Page Not Found');
    done();
  });
});

describe('Login Endpoint', () => {
  it('gets the login endpoint', async (done) => {
    const response = await request.post('/login').send({
      user: 'demodappuser',
    });

    expect(response.status).toBe(200);
    expect(response.body.result).toBe('done');
    done();
  });
});

describe('Auth Endpoint', () => {
  it('should be redirected to the login page', async (done) => {
    const response = await request.get('/authtest');

    expect(response.status).toBe(302);
    done();
  });
});
