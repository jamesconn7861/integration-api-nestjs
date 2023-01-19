import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastify from 'fastify';
import { vlanLogger } from '../src/middleware/logger/vlan-logger';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const levels = {
      alert: 70,
      crit: 60,
      error: 50,
      warn: 40,
      notice: 30,
      info: 20,
      vlan: 13,
    };

    const fastifyInstance = fastify({
      logger: {
        file: `./logs/api.log`,
        customLevels: levels,
        useOnlyCustomLevels: true,
      },
    });

    fastifyInstance.addHook('preHandler', vlanLogger);

    app = moduleRef.createNestApplication(new FastifyAdapter(fastifyInstance));

    // Added whitelisting to remove unwanted body keys.
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
    await app.listen(3003);

    pactum.request.setBaseUrl('http://localhost:3003');

    await pactum
      .spec()
      .post('/vlan-changer/change')
      .withBody({
        user: 'jconn',
        ports: [1, 1],
        vlan: 753,
        benchId: '131',
      });
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

    /*
    Removed this now that there is a permanent password
    set. For this test to pass, the file would need to 
    contain the clear text password. 
*/

    //   describe('Update app data', () => {
    //     it('should update app init data.', () => {
    //       return pactum
    //         .spec()
    //         .post('/cached/update-app-data')
    //         .withBody({ pass: '' })
    //         .expectBodyContains('Update Complete')
    //         .expectStatus(201)
    //         .inspect();
    //     });
    //   });
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

  describe('Vlan Changer', () => {
    describe('Change vlans', () => {
      it('should change the vlan.', () => {
        return pactum
          .spec()
          .post('/vlan-changer/change')
          .withBody({
            user: 'jconn',
            ports: [1, 1],
            vlan: 720,
            benchId: '131',
          })
          .expectStatus(201);
      }, 10000);
    });

    describe('Check vlans', () => {
      it('should check the vlans.', () => {
        return pactum
          .spec()
          .get('/vlan-changer/131')
          .expectStatus(200)
          .expectBodyContains('720');
      }, 12000);
    });
  });

  describe('Order Tracking', () => {
    describe('Upload order', () => {
      it('should upload one or more orders', () => {
        return pactum
          .spec()
          .post('/order-tracking/upload')
          .withBody({
            orderIds: [701238824],
            user: 'jconn',
            createdAt: '2023-01-10 10:24:00',
          })
          .expectStatus(201);
      });
    });

    // describe('Get order by user', () => {
    //   it('should get users orders', () => {
    //     return pactum
    //       .spec()
    //       .get('/order-tracking/user/jconn')
    //       .expectStatus(200)
    //       .expectBodyContains('701238824');
    //   });
    // });

    describe('Get order by id', () => {
      it('show get an order by id', () => {
        return pactum
          .spec()
          .get('/order-tracking/order/701238824')
          .expectBodyContains('701238824')
          .expectStatus(200);
      });
    });

    describe('Get active orders by user', () => {
      it('should get active orders with user', () => {
        return pactum
          .spec()
          .get('/order-tracking/user/jconn/active')
          .expectBodyContains('701238824')
          .expectStatus(200);
      });
    });

    describe('Update order', () => {
      it('show update an order', () => {
        return pactum
          .spec()
          .patch('/order-tracking/update')
          .withBody({
            orderId: 701238824,
            user: 'jconn',
            completedAt: '2023-01-18 09:53:16',
            status: 1,
            note: 'This is a test.',
          })
          .expectStatus(200);
      });
    });

    describe('Get completed orders by user', () => {
      it('should get completed orders with user', () => {
        return pactum
          .spec()
          .get('/order-tracking/user/jconn/closed')
          .expectBodyContains('701238824')
          .expectStatus(200);
      });
    });

    describe('Delete order by id and user', () => {
      it('should delete the order with the id and user', () => {
        return pactum
          .spec()
          .post('/order-tracking/delete')
          .expectStatus(201)
          .withBody({
            orderIds: [701238824],
            user: 'jconn',
          });
      });
    });
  });

  afterAll(async () => {
    await pactum
      .spec()
      .post('/vlan-changer/change')
      .withBody({
        user: 'jconn',
        ports: [1, 1],
        vlan: 753,
        benchId: '131',
      });
    app.close();
  });
});
