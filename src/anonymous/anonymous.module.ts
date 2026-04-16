import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AnonymousStrategy } from './anonymous.strategy';

@Module({
  imports: [PassportModule],
  providers: [AnonymousStrategy],
  exports: [PassportModule], 
})
export class AnonymousModule {}