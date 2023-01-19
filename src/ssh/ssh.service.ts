import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyBaseLogger, FastifyLogFn } from 'fastify';
import { Client } from 'ssh2';

/*
  SSH service for communicating with the integration
  & depot switch. Currently, the safest solution to
  prevent lingering connections and ensure the response
  is correct, is to open, close and delete the connection
  for each request. 

  This will probably not recieve any updates unless the 
  https feature for the switch is deemed unsafe. -- Well
  that was a lie.

  Made one small update. Since sshClient doesn't have an 
  internal function to check connection, we use a local
  variable. On ready it is set to true and on any event
  that causes it to lose connection, it is set to false.

  Before any request is made we check if we have connection.
  If we do, send the request. If not, connect first then
  send the request. This should cut down response times
  significantly since the connection is being reused.
*/

@Injectable()
export class SshService {
  sshClient: Client;
  sshConfig: any;
  clientConnected: boolean;
  logger: FastifyBaseLogger;
  testLogger: logger;
  constructor(
    private readonly httpAdatper: HttpAdapterHost,
    private readonly config: ConfigService,
  ) {
    /* 
    These values are hosted in the .env files.
    DO NOT UPLOAD SECURE CREDENTIALS TO GITHUB!
    IS NO GOOD, CREDENTIALS IMPORTANT, SOMETIMES
    */
    this.sshConfig = {
      host: config.get('SSH_HOST'),
      port: config.get('SSH_PORT'),
      username: config.get('SSH_USER'),
      password: config.get('SSH_PASS'),
    };

    this.logger = this.httpAdatper.httpAdapter.getInstance()
      .log as FastifyBaseLogger;

    this.createClient();
    this.sshClient.connect(this.sshConfig);
  }

  /*
    Just incase the switch decides to get creative
    and send a different signal, I've included listeners
    for all 'exit' codes. 
    
    Until it gains sentience, I'll assume those codes are 
    limited to 'close', 'end' and 'error'.
  */
  createClient() {
    this.sshClient = new Client();
    this.sshClient
      .on('ready', () => {
        this.logger.info('SSH client ready.');
        this.clientConnected = true;
      })
      .on('error', (err) => {
        this.cleanupClient();
        throw err;
      })
      .on('end', () => {
        this.cleanupClient();
      })
      .on('close', () => this.cleanupClient());
  }

  cleanupClient() {
    this.logger.info(
      'SSH client disconnected. Client will be reconnected on next request.',
    );
    this.sshClient.destroy();
    this.clientConnected = false;
  }

  async sendCommand(command: string, config?: any) {
    return new Promise((resolve) => {
      if (!this.clientConnected) {
        this.sshClient.connect(this.sshConfig);
      }

      let stdErr: string;
      let stdOut: string;

      this.sshClient.exec(command, (err: any, stream: any) => {
        if (err) throw err;
        stream
          .on('close', () => {
            resolve({ stdOut, stdErr });
          })
          .on('exit', () => {
            resolve({ stdOut, stdErr });
          })
          .on('end', () => {
            resolve({ stdOut, stdErr });
          })
          .on('data', (data: any) => {
            stdOut += data;
          })
          .stderr.on('data', (data: any) => {
            stdErr += data;
          });
      });
    });
  }
}

interface logger extends FastifyBaseLogger {
  vlan?: FastifyLogFn;
}
