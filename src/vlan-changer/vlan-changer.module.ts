import { Module } from '@nestjs/common';
import { CachedModule } from 'src/cached/cached.module';
import { SshModule } from 'src/ssh/ssh.module';
import { VlanChangerController } from './vlan-changer.controller';
import { VlanChangerService } from './vlan-changer.service';

@Module({
  imports: [SshModule, CachedModule],
  controllers: [VlanChangerController],
  providers: [VlanChangerService],
})
export class VlanChangerModule {}
