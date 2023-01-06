import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    await app.listen(3003);

    pactum.request.setBaseUrl('http://localhost:3003');
  });

  describe('AppData', () => {
    describe('Get app data', () => {
      it('should return app init data.', () => {
        return pactum
          .spec()
          .get('/cached/app-data')
          .expectBodyContains('tableSchema')
          .expectStatus(200);
      });
    });

    describe('Update app data', () => {
      it('should update app init data.', () => {
        return pactum
          .spec()
          .post('/cached/update-app-data')
          .withBody({ pass: 'upd@t3' })
          .expectBodyContains('Update Complete')
          .expectStatus(201)
          .inspect();
      });
    });
  });

  describe('Labels', () => {
    describe('Upload label(s)', () => {
      it('should upload one label.', () => {
        return pactum
          .spec()
          .post('/labels/upload')
          .withBody({
            user: 'jconn',
            table: 'order_numbers',
            columns: ['data', 'quantity', 'serialize', 'username'],
            rows: [['7011234124', 1, 1, 'jconn']],
          })
          .expectStatus(201);
      });

      it('should upload multiple labels.', () => {
        return pactum
          .spec()
          .post('/labels/upload')
          .withBody({
            user: 'jconn',
            table: 'order_numbers',
            columns: ['data', 'quantity', 'serialize', 'username'],
            rows: [
              ['7011234124', 1, 1, 'jconn'],
              ['704565465', 1, 1, 'jconn'],
            ],
          })
          .expectStatus(201);
      });
    });

    describe('Get labels by table and user', () => {
      it('should return labels based on the table and user', () => {
        return pactum
          .spec()
          .get('/labels/order_numbers/jconn')
          .expectBodyContains('jconn')
          .expectStatus(200);
      });
    });
  });

  describe('Order Tracking', () => {
    describe('Upload order(s)', () => {
      it('should upload a new order', () => {
        return pactum
          .spec()
          .post('/orders/upload')
          .withBody({
            tech: 'jconn',
            startTime: new Date()
              .toISOString()
              .slice(0, 19)
              .replace('T', ' ')
              .toString(),
            orders: ['712345678', '712345679'],
          })
          .expectStatus(201)
          .inspect();
      });
    });

    describe('Edit order', () => {
      it('should edit a order', () => {
        return pactum
          .spec()
          .patch('/orders/edit')
          .withBody({
            order_number: '712345678',
            tech: 'jconn',
            end_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
            is_active: '0',
            note: 'testing',
          })
          .expectStatus(200);
      });
    });

    describe('Delete order(s)', () => {
      it('should delete orders', () => {
        return pactum
          .spec()
          .delete('/orders/delete')
          .withBody({
            orderNumbers: ['712345679'],
          })
          .expectStatus(200);
      });
    });

    describe('Get orders', () => {
      it('should get orders by user', () => {
        return pactum
          .spec()
          .get('/orders/jconn')
          .expectStatus(200)
          .expectBodyContains('testing');
      });
    });
  });

  afterAll(() => {
    app.close();
  });
});
