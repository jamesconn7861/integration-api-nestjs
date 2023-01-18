import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { bodyLogger } from './middleware/logger/logger';

async function bootstrap() {
  /*
    NOTE Changed from express to fastify. Dramatically increased response times.
    As of now, all functions work exactly the same as if express was used. 
    Reverting back to express shouldn't* break any code or at least very little.
  */

  const fastifyInstance = fastify({
    logger: {
      file: `./logs/api.log`,
      // customLevels: {
      //   vlanChanged: 13,
      // },
    },
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance),
  );

  // Added whitelisting to remove unwanted body keys.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // TODO Change this to the correct port before production build
  await app.listen(3000);
}
bootstrap();
