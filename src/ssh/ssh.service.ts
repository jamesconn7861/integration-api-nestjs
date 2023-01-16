import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'ssh2';

/*
  SSH service for communicating with the integration
  & depot switch. Currently, the safest solution to
  prevent lingering connections and ensure the response
  is correct, is to open, close and delete the connection
  for each request. 

  This will probably not recieve any updates unless the 
  https feature for the switch is deemed unsafe.
*/

@Injectable()
export class SshService {
  sshClient: Client;
  sshConfig: any;
  constructor(config: ConfigService) {
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

    console.log('SSH Client Initiated');
  }

  /*
    Just incase the switch decides to get creative
    and send a different signal, I've included listeners
    for all 'exit' codes. 
    
    Until it gains sentience, I'll assume those codes are 
    limited to 'close', 'exit' and 'end'.
  */
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
