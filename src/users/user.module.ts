import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { ConfigCustomModule } from '../config/config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User], 'mysql'),
    ConfigCustomModule, // ESSENCIAL PARA INJETAR AppConfigService
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}