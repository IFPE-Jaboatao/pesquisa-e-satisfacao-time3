import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  OnModuleInit 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User, 'mysql')
    private repo: Repository<User>,

    private configService: AppConfigService,
  ) {}

  // -------------------------------------------------------------------------
  // INICIALIZAÇÃO E SEED
  // -------------------------------------------------------------------------

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminExists = await this.repo.findOne({
      where: { role: Role.ADMIN },
    });

    if (adminExists) return;

    const passwordEnv = this.configService.seedAdminPassword;
    const password = (passwordEnv && passwordEnv.trim().length > 0)
      ? passwordEnv
      : 'admin123';

    if (!passwordEnv) {
      console.warn('⚠️ SEED_ADMIN_PASSWORD não configurado, usando padrão "admin123"');
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = this.repo.create({
      matricula: 'admin',
      nome: 'Administrador',
      email: 'admin@example.com',
      password: hashed,
      role: Role.ADMIN,
    });

    await this.repo.save(admin);
    console.log('✔ Admin seed criado com sucesso');
  }

  // -------------------------------------------------------------------------
  // MÉTODOS DE BUSCA
  // -------------------------------------------------------------------------

  findByMatricula(matricula: string) {
    return this.repo.findOne({ where: { matricula } });
  }

  async findAll() {
    return this.repo.find({
      select: ['id', 'matricula', 'nome', 'email', 'role'],
    });
  }

  async findOne(userId: string | number) {
    const id = Number(userId);

    const user = await this.repo.findOne({
      where: { id },
      select: ['id', 'matricula', 'nome', 'email', 'role'],
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  // -------------------------------------------------------------------------
  // MÉTODOS DE ESCRITA
  // -------------------------------------------------------------------------

  async create(dto: CreateUserDto) {
    const userExists = await this.findByMatricula(dto.matricula);
    if (userExists) {
      throw new ConflictException('Esta matrícula já está em uso');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.repo.create({
      matricula: dto.matricula,
      nome: dto.nome,
      email: dto.email,
      role: dto.role ?? Role.ALUNO,
      password: hashed,
    });

    const savedUser = await this.repo.save(user);

    return {
      id: savedUser.id,
      matricula: savedUser.matricula,
      nome: savedUser.nome,
      email: savedUser.email,
      role: savedUser.role,
    };
  }

  async update(userId: string, dto: Partial<{ matricula: string; password: string }>) {
    const id = Number(userId);

    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);

    const updated = await this.repo.save(user);

    return {
      id: updated.id,
      matricula: updated.matricula,
      nome: updated.nome,
      email: updated.email,
      role: updated.role,
    };
  }

  async updatePassword(userId: string, passwordRaw: string) {
    const id = Number(userId);

    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const hashed = await bcrypt.hash(passwordRaw, 10);
    user.password = hashed;

    await this.repo.save(user);

    return { message: 'Senha atualizada com sucesso' };
  }

  async delete(userId: string) {
    const id = Number(userId);

    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    await this.repo.remove(user);

    return { message: `Usuário "${user.matricula}" removido com sucesso` };
  }
}