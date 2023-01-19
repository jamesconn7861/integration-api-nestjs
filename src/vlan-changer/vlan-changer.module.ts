import { Module } from '@nestjs/common';
import { CachedModule } from '../cached/cached.module';
import { SshModule } from '../ssh/ssh.module';
import { VlanChangerController } from './vlan-changer.controller';
import { VlanChangerService } from './vlan-changer.service';

@Module({
  imports: [SshModule, CachedModule],
  controllers: [VlanChangerController],
  providers: [VlanChangerService],
})
export class VlanChangerModule {}
