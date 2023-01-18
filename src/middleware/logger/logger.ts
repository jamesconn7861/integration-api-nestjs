import { FastifyRequest } from 'fastify';

export function bodyLogger(req: FastifyRequest, _reply: any, next: any) {
  next();
}
