import { FastifyRequest } from 'fastify';

export function vlanLogger(req: FastifyRequest, _reply: any, next: any) {
  req.log.warn({ vlanChanged: req.body });
  next();
}
