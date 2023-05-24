import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import fastify from 'fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { vlanLogger } from './middleware/logger/vlan-logger';

async function bootstrap() {
  /*
    NOTE Changed from express to fastify. Dramatically increased response times.
    As of now, all functions work exactly the same as if express was used. 
    Reverting back to express shouldn't* break any code or at least very little.
  */

  const env = process.env.NODE_ENV || 'dev';
  const logPath: string = env == 'dev' ? `./logs/debug.log` : `./logs/api.log`;

  const fastifyInstance = fastify({
    logger: {
      file: logPath,
      level: 'warn'
    },
  });

  // No need to log all routes, just vlan changes & admin changes.
  // fastifyInstance.addHook('preHandler', vlanLogger);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance),
  );

  // Not currently using cookies, will most likely change in the future.
  // await app.register(fastifyCookie, {
  //   secret: 'fastify-|secret*|-cookie',
  // });

  // Added whitelisting to remove unwanted body keys.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Integration Toolkit API')
    .setDescription('API routes for Integration Toolkit data')
    .setVersion('1.0')
    .addServer('https://integration-toolkit.pomeroy.com/dev/api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.enableCors();
  // TODO Change this to the correct port before production build
  await app.listen(3000);
}
bootstrap();
