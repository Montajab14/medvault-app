import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';


const request = require('supertest');

describe('B8 - Tests e2e patients', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  it('1) Inscription utilisateur', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'testb8@example.com',
        password: 'password',
      })
      .expect(201);

    expect(res.body).toBeDefined();
  });

  it('2) Connexion pour obtenir un JWT', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'testb8@example.com',
        password: 'password',
      })
      .expect(201);

    expect(res.body).toHaveProperty('access_token');
    token = res.body.access_token;
  });

  it('3) Création d’un patient lié au user', async () => {
    const res = await request(app.getHttpServer())
      .post('/patients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullname: 'Bob Marley',
        age: 36,
        symptoms: 'maux de tête',
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('owner');
    expect(res.body.owner).toHaveProperty('id');
  });

  it('4) Récupération des patients du user', async () => {
    const res = await request(app.getHttpServer())
      .get('/patients')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('fullname');
  });

  afterAll(async () => {
    await app.close();
  });
});
