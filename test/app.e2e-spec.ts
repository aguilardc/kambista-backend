import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ExchangeRateDocument,
  ExchangeRateModel,
} from '@src/modules/currency/infrastructure/adapters/out/schemas/exchange-rate.schema';

describe('Reto Kambista - Flujo Completo (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let exchangeRateModel: Model<ExchangeRateDocument>;
  const testUser = {
    email: `kambista-${Date.now()}@test.com`,
    password: 'Password123!',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    await app.init();

    exchangeRateModel = app.get<Model<ExchangeRateDocument>>(
      getModelToken(ExchangeRateModel.name),
    );

    await exchangeRateModel.deleteMany({ currencyCode: 'USD' });
    await exchangeRateModel.create({
      currencyCode: 'USD',
      buyRate: 3.7,
      sellRate: 3.8,
      syncDate: new Date(),
    });
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('1. POST /auth/register - Debe registrar un nuevo usuario', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Usuario registrado exitosamente');
  });

  it('2. POST /auth/login - Debe autenticar al usuario y devolver un token JWT', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(testUser)
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
    jwtToken = response.body.accessToken; // Guardamos el token para los siguientes endpoints
  });

  it('3. POST /transactions - Debe rechazar la transacción si el JWT no es enviado', async () => {
    await request(app.getHttpServer())
      .post('/transactions')
      .send({
        sourceCurrency: 'USD',
        targetCurrency: 'PEN',
        amount: 100,
      })
      .expect(401);
  });

  it('4. POST /transactions - Debe validar el DTO y rechazar montos negativos', async () => {
    const response = await request(app.getHttpServer())
      .post('/transactions')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        sourceCurrency: 'USD',
        targetCurrency: 'PEN',
        amount: -50,
      })
      .expect(400);

    expect(response.body.message).toBeDefined();
    expect(response.body.message[0]).toContain('mayor a cero');
  });

  it('5. POST /transactions - Debe procesar la transacción aplicando la tasa de COMPRA', async () => {
    const response = await request(app.getHttpServer())
      .post('/transactions')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        sourceCurrency: 'USD',
        targetCurrency: 'PEN',
        amount: 100, // 100 USD * 3.70 (compra) = 370 PEN
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.sourceCurrency).toBe('USD');
    expect(response.body.targetCurrency).toBe('PEN');
    expect(response.body.exchangeRateApplied).toBe(3.7);
    expect(response.body.finalAmount).toBe(370);
  });

  it('6. GET /transactions/history - Debe devolver el historial con la transacción reciente', async () => {
    const response = await request(app.getHttpServer())
      .get('/transactions/history')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);

    // Verificamos que el primer elemento sea la transacción que acabamos de crear
    const lastTx = response.body[0];
    expect(lastTx.sourceCurrency).toBe('USD');
    expect(lastTx.finalAmount).toBe(370);
    expect(lastTx).toHaveProperty('createdAt');
  });
});
