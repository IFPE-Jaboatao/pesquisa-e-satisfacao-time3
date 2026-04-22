import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';

@Module({
  imports: [
    // Garante que o repositório de User use a conexão MySQL definida no AppModule
    TypeOrmModule.forFeature([User], 'mysql'),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Exportado para ser usado pelo AuthModule
})
export class UsersModule {}