import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'ssh2';

@Injectable()
export class SshService {
  sshClient: Client;
  sshConfig: any;
  constructor(config: ConfigService) {
    this.sshConfig = {
      host: config.get('SSH_HOST'),
      port: config.get('SSH_PORT'),
      username: config.get('SSH_USER'),
      password: config.get('SSH_PASS'),
    };

    console.log('SSH Client Initiated');
  }

  sendCommand(command: string, config?: any) {
    return new Promise((resolve) => {
      let stdErr: string;
      let stdOut: string;

      this.sshClient = new Client();
      this.sshClient
        .on('ready', () => {
          this.sshClient
            .exec(command, (err: any, stream: any) => {
              if (err) {
                try {
                  this.sshClient.destroy();
                } catch {}
                throw err;
              }
              stream
                .on('close', () => {
                  stream;
                  this.sshClient.destroy();
                  resolve({ stdOut, stdErr });
                })
                .on('exit', () => {
                  this.sshClient.destroy();
                  resolve({ stdOut, stdErr });
                })
                .on('end', () => {
                  this.sshClient.destroy();
                  resolve({ stdOut, stdErr });
                })
                .on('data', (data: any) => {
                  stdOut += data;
                })
                .stderr.on('data', (data: any) => {
                  stdErr += data;
                });
            })
            .on('close', () => {
              this.sshClient.destroy();
              this.sshClient == undefined;
            });
        })
        .connect(this.sshConfig);
    });
  }
}
