import { Injectable, Logger } from '@nestjs/common';
import { SshService } from '../ssh/ssh.service';
import { SetVlansDto } from './dtos';
import { SwitchObject, VlanObject } from '../cached/types';
import { createRangeString, parseSwitchStatus } from './utils';
import { ChangeParams } from './types';
import { CachedService } from '../cached/cached.service';
import { HttpAdapterHost } from '@nestjs/core';

@Injectable()
export class VlanChangerService {
  constructor(
    private sshClient: SshService,
    private cachedService: CachedService,
    private readonly adapterHost: HttpAdapterHost
  ) {}

  async getPortsByBench(benchId: string) {
    const foundBench: SwitchObject = await this.findSwitch(benchId);

    if (!foundBench) {
      return { stdErr: 'Invalid bench / switch id.' };
    }

    const sshResponse: Object = await this.sshClient.sendCommand(
      `show int status | grep Eth${foundBench.switch}`,
    );

    if ('stdErr' in sshResponse && sshResponse.stdErr != undefined) {
      return sshResponse;
    }

    return await parseSwitchStatus(
      sshResponse['stdOut'],
      foundBench.range.split('-'),
    );
  }

  async setVlans(setVlansDto: SetVlansDto) {
    let [err, changeParams] = await this.validateRequest(setVlansDto);
    if (err) return err['message'];

    const result = await createRangeString(changeParams);
    changeParams = { ...changeParams, ...result };

    const sshResponse: Object = await this.sshClient.sendCommand(
      `conf t ; int ${changeParams.rangeString} ; switchport access vlan ${changeParams.vlanId}`,
    );

    if ('stdErr' in sshResponse && sshResponse.stdErr != undefined) {
      return sshResponse;
    }

    this.adapterHost.httpAdapter.getInstance().log.warn({Request: changeParams}, 'Vlans Changed');

    if (changeParams.skippedPorts && changeParams.skippedPorts.length > 0) {
      return {
        stdOut: `Locked ports detected. The following port(s) were not changed: (${changeParams.skippedPorts.toString()}). Please see Chris or James if these ports need to be changed.`,
      };
    } else {
      return {
        stdOut: `All ports in range succesfully changed.`,
      };
    }
  }

  async findSwitch(benchId: string | number): Promise<SwitchObject> {
    const foundSwitch: SwitchObject =
      this.cachedService.getBenchSchemaById(benchId);

    if (!foundSwitch) return;

    /*
    Check if request was made with the switch number or bench name.
    If request was made with the switch number, find the exact match and return all ports.
    If requet was made with the bench name, find the exact match (case insensative) and return pre-configured port range.
    */

    if (typeof benchId === 'number') {
      return { ...foundSwitch, range: '1-48' };
    } else {
      return { ...foundSwitch };
    }
  }

  async validateRequest(setVlansDto: SetVlansDto): Promise<[{}, ChangeParams]> {
    const changeParams: ChangeParams = {} as ChangeParams;
    // Check for valid user id
    if (
      [null, undefined, ''].includes(setVlansDto.user) ||
      setVlansDto.user.length < 2
    ) {
      return [{ message: 'Invalid user id.' }, undefined];
    }
    changeParams.user = setVlansDto.user;

    // Check for valid bench id
    const foundBench = await this.findSwitch(setVlansDto.benchId);
    if (!foundBench)
      return [{ message: 'Invalid bench / switch id.' }, undefined];
    changeParams.benchId = foundBench.switch;
    changeParams.switchRange = foundBench.range
      .split('-')
      .map((port) => Number(port)) as [number, number];
    if (foundBench.locked != null || foundBench.locked != undefined) {
      changeParams.lockedPorts = foundBench.locked
        .split(',')
        .map((port) => Number(port));
    }

    // Check for valid vlan
    const foundVlan: VlanObject = this.cachedService.getVlanSchemaById(
      setVlansDto.vlan,
    );
    if (!foundVlan) return [{ message: 'Invalid vlan id.' }, undefined];
    changeParams.vlanId = foundVlan.id;

    // Check for valid port range
    const range = foundBench.range.split('-').map((port) => +port);
    if (setVlansDto.ports[0] < range[0] || setVlansDto.ports[0] > range[1]) {
      return [{ message: 'Starting port out of valid range.' }, undefined];
    }

    if (
      setVlansDto.ports[1] < range[0] ||
      setVlansDto.ports[1] > range[1] ||
      setVlansDto.ports[1] < setVlansDto.ports[0]
    ) {
      return [{ message: 'End port out of valid range.' }, undefined];
    }

    changeParams.reqRange = setVlansDto.ports;
    return [undefined, changeParams];
  }
}