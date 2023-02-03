import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import fastify from 'fastify';
import { vlanLogger } from './middleware/logger/vlan-logger';
import fastifyCookie from '@fastify/cookie';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const env = process.env.NODE_ENV || 'dev';
  const logPath: string = env == 'dev' ? `./logs/api.log` : `./logs/debug.log`;

  const fastifyInstance = fastify({
    logger: {
      file: logPath,
      customLevels: levels,
      useOnlyCustomLevels: true,
    },
  });

  fastifyInstance.addHook('preHandler', vlanLogger);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance),
  );

  await app.register(fastifyCookie, {
    secret: 'fastify-|secret*|-cookie',
  });

  // Added whitelisting to remove unwanted body keys.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // const config = new DocumentBuilder()
  //   .setTitle('Integration Toolkit API')
  //   .setDescription('API routes for Integration Toolkit data')
  //   .setVersion('1.0')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);

  app.enableCors();
  // TODO Change this to the correct port before production build
  await app.listen(3000);
}
bootstrap();
