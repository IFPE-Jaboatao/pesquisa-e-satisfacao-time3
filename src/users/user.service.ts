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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User, 'mysql')
    private repo: Repository<User>,

    private configService: ConfigService,
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

    const passwordEnv = this.configService.get<string>('SEED_ADMIN_PASSWORD');
    const password = (passwordEnv && passwordEnv.trim().length > 0) ? passwordEnv : 'admin123';

    if (!passwordEnv) {
      console.warn('⚠️ SEED_ADMIN_PASSWORD não configurado no .env, usando padrão "admin123"');
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = this.repo.create({
      username: 'admin',
      password: hashed,
      role: Role.ADMIN,
    });

    await this.repo.save(admin);
    console.log('✔ Admin seed criado com sucesso');
  }

  // -------------------------------------------------------------------------
  // MÉTODOS DE BUSCA
  // -------------------------------------------------------------------------

  findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  async findAll() {
    // Retorna apenas dados não sensíveis
    return this.repo.find({
      select: ['id', 'username', 'role'],
    });
  }

  async findOne(userId: string | number) {
    const user = await this.repo.findOne({ 
      where: { id: Number(userId) },
      select: ['id', 'username', 'role'] // Segurança: não traz o hash da senha
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  // -------------------------------------------------------------------------
  // MÉTODOS DE ESCRITA
  // -------------------------------------------------------------------------

  async create(dto: CreateUserDto) {
    // Validação de duplicidade
    const userExists = await this.findByUsername(dto.username);
    if (userExists) throw new ConflictException('Este nome de usuário já está em uso');

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.repo.create({
      username: dto.username,
      role: dto.role ?? Role.ALUNO,
      password: hashed,
    });

    const savedUser = await this.repo.save(user);
    
    return {
      id: savedUser.id,
      username: savedUser.username,
      role: savedUser.role,
    };
  }

  async update(userId: string, dto: Partial<{ username: string; password: string }>) {
    // Busca sem o filtro de select para poder manipular a entidade completa internamente
    const user = await this.repo.findOne({ where: { id: Number(userId) } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    const updated = await this.repo.save(user);

    return {
      id: updated.id,
      username: updated.username,
      role: updated.role,
    };
  }

  async updatePassword(userId: string, passwordRaw: string) {
    const user = await this.repo.findOne({ where: { id: Number(userId) } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const hashed = await bcrypt.hash(passwordRaw, 10);
    user.password = hashed;

    await this.repo.save(user);
    return { message: 'Senha atualizada com sucesso' };
  }

  async delete(userId: string) {
    const user = await this.repo.findOne({ where: { id: Number(userId) } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    await this.repo.remove(user);
    return { message: `Usuário "${user.username}" removido com sucesso` };
  }
}