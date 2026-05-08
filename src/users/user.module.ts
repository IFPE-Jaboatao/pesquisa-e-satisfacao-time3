import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { ConfigModule } from '../config/config.module'; // Atualizado para ConfigModule
import { PesquisasModule } from 'src/pesquisas/pesquisas.module';
import { AcademicModule } from 'src/academic/academic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User], 'mysql'),
    ConfigModule, // Atualizado para ConfigModule
    PesquisasModule,
    AcademicModule
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}