import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { ConfigModule } from '../config/config.module'; // Atualizado para ConfigModule
import { PesquisasModule } from 'src/pesquisas/pesquisas.module';
import { AcademicModule } from 'src/academic/academic.module';
import { InstitutionalModule } from 'src/institutional/institutional.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User], 'mysql'),
    ConfigModule, // Atualizado para ConfigModule
    PesquisasModule,
    AcademicModule,
    InstitutionalModule
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}