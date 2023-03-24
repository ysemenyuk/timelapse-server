import request from 'supertest';
import { describe, beforeAll, afterAll, beforeEach, afterEach, it, expect } from '@jest/globals';
import 'dotenv/config';
import config from './config.js';
import MongoDB from '../src/db/mongo.db.js';
import getServices from '../src/services/index.js';
import getServer from '../src/server.js';

describe('requests', () => {
  let db;
  let app;

  beforeAll(async () => {
    const services = getServices(config);

    db = new MongoDB();
    app = getServer(services);

    await db.connect(config, () => {});
  });

  beforeEach(async () => {
    //
  });

  afterEach(async () => {
    //
  });

  afterAll((done) => {
    db.disconnect();
    done();
  });

  //
  //
  //

  it('GET 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});
