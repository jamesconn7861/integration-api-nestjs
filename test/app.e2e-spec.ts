import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { DbService } from '../src/db/db.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dbService: DbService;
  let checkValue: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    await app.listen(3003);

    dbService = app.get(DbService);
    pactum.request.setBaseUrl('http://localhost:3003');
    checkValue = '704565465';
  });

  describe('Labels', () => {
    describe('Upload', () => {
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

    describe('Find', () => {
      it('should return labels based on the table and user', () => {
        return pactum
          .spec()
          .get('/labels/order_numbers/jconn')
          .expectBodyContains(checkValue)
          .expectStatus(200);
      });
    });
  });

  afterAll(() => {
    app.close();
  });
});
