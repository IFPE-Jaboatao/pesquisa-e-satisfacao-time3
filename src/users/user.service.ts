import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, 'mysql')
    private repo: Repository<User>,
  ) {}

  findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }

   async create(dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.repo.create({
      username: dto.username,
      role: dto.role ?? Role.ALUNO,
      password: hashed,
    });

    return this.repo.save(user);
  }

  async findAll() {
    return this.repo.find();
  }

  async findOne(userId: string) {
    const user = await this.repo.findOne({ where: { id: Number(userId) } });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async update(userId: string, dto: Partial<{ username: string; password: string }>) {
    const user = await this.findOne(userId);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);

    return this.repo.save(user);
  }

  async delete(userId: string) {
    const user = await this.findOne(userId);

    return this.repo.remove(user);
  }

}