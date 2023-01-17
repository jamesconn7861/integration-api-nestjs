import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';

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
      });
    });
  });

  afterAll(() => {
    pactum
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
