import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import fastify from 'fastify';
import { vlanLogger } from './middleware/logger/vlan-logger';

async function bootstrap() {
  /*
    NOTE Changed from express to fastify. Dramatically increased response times.
    As of now, all functions work exactly the same as if express was used. 
    Reverting back to express shouldn't* break any code or at least very little.
  */

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
