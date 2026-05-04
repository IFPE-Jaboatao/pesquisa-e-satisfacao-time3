import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { ConfigModule } from '../config/config.module'; // Atualizado para ConfigModule

@Module({
  imports: [
    TypeOrmModule.forFeature([User], 'mysql'),
    ConfigModule, // Atualizado para ConfigModule
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}