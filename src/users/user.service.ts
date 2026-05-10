import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  OnModuleInit 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { AppConfigService } from '../config/config.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DocenteDeletedEvent } from 'src/shared/events/docente-deleted.event';
import { AlunoDeletedEvent } from 'src/shared/events/aluno-deleted.event';
import { MatriculaService } from 'src/academic/matricula/matricula.service';
import { PesquisasService } from 'src/pesquisas/pesquisas.service';
import { CampusService } from 'src/institutional/campus/campus.service';
import { PeriodoService } from 'src/academic/periodo/periodo.service';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User, 'mysql')
    private repo: Repository<User>,

    private configService: AppConfigService,

    private readonly eventEmitter: EventEmitter2,

    private readonly matriculaService: MatriculaService,

    private readonly pesquisaService: PesquisasService,

    private readonly campusService: CampusService,

    private readonly periodoService: PeriodoService,
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
      withDeleted: false
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

  async findDeleted() {
    return await this.repo.find({
      where: { deletedAt: Not(IsNull()) },
      withDeleted: true,
      select: ['id', 'matricula', 'nome', 'email', 'role', 'createdAt', 'updatedAt', 'deletedAt']
    });
  }

  // função utilizada por auth.service para validar usuário no login
  findByMatricula(matricula: string) {
    return this.repo.findOne({ where: { matricula }, withDeleted: false, relations: { campus: true } });
  }

  async findAll() {
    return this.repo.find({
      select: ['id', 'matricula', 'nome', 'email', 'role'],
      withDeleted: false
    });
  }

  async findOne(userId: string | number) {
    const id = Number(userId);

    const user = await this.repo.findOne({
      where: { id },
      select: ['id', 'matricula', 'nome', 'email', 'role'],
      withDeleted: false
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  // DASHBOARDS

  async getDashboardAluno(userId: number, campusId: number) {
    // 1. Pega as matrículas do aluno no MySQL
    const matriculas = await this.matriculaService.findAllStudent(userId);

    // 2. Extrai apenas os IDs das turmas para facilitar a busca no Mongo
    const turmaIds = matriculas.matriculas
      .map(m => m.turma?.id)
      .filter((id): id is number => id !== undefined && id !== null);

    // 3. Busca todas as pesquisas relevantes
    const { avaliacoesDocente, filteredSatisfacao } = await this.pesquisaService.findByAluno(campusId, turmaIds);

    // Retorno formatado para o dashboard do Front-end
    return {
      alunoId: userId,
      resumo: {
        avaliacoes: avaliacoesDocente.length,
        satisfacoes: filteredSatisfacao.length
      },
      avaliacoesDocente,
      filteredSatisfacao
    };
  }

    // DASHBOARD DOCENTE
  async getDashboardDocente(userId: number) {
    const avaliacoes = await this.pesquisaService.findByDocente(userId);

    return {
      docenteId: userId,
      avaliacoes
    };
  }

    // DASHBOARD GESTOR
  async getDashboardGestor() {
    const pesquisas = await this.pesquisaService.findAll();

    return {
      pesquisas
    };
  }

      // DASHBOARD GESTOR
  async getDashboardAdmin() {
    const campus = await this.campusService.findAllFull();

    const periodos = await this.periodoService.findAll();

    const users = await this.repo.find({
      select: ['id', 'matricula', 'nome', 'role', 'email'],
      withDeleted: false
    });

    const matriculas = await this.matriculaService.findAll();

    return {
      campus,
      periodos,
      users,
      matriculas
    };
  }

  // -------------------------------------------------------------------------
  // MÉTODOS DE ESCRITA
  // -------------------------------------------------------------------------

  async create(dto: CreateUserDto) {
    const userExists = await this.findByMatricula(dto.matricula);
    if (userExists) {
      throw new ConflictException('Esta matrícula já está em uso');
    }

    // verifica se o email já está em uso
    const emailExists = await this.repo.findOne({ where: { email: dto.email }, withDeleted: false });
    if (emailExists) {
      throw new ConflictException('Este email já está em uso');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.repo.create({
      matricula: dto.matricula,
      nome: dto.nome,
      email: dto.email,
      role: dto.role ?? Role.ALUNO,
      campus: dto.campusId && dto.role !== Role.ADMIN ? { id: dto.campusId } : undefined,
      password: hashed,
    });

    const savedUser = await this.repo.save(user);

    return {
      id: savedUser.id,
      matricula: savedUser.matricula,
      nome: savedUser.nome,
      email: savedUser.email,
      role: savedUser.role,
      campus: savedUser.campus ? { id: savedUser.campus.id } : undefined
    };
  }

  async update(userId: string, dto: Partial<{ matricula: string; password: string, email: string; nome: string; role: Role, campusId: number }>) {
    const id = Number(userId);
    
    const user = await this.repo.findOne({ where: { id }, withDeleted: false });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    
    // verifica se o email já está em uso por outro usuário
    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.repo.findOne({ where: { email: dto.email }, withDeleted: false });

      if (emailExists) {
        throw new ConflictException('Este email já está em uso.');
      }
    }

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
      campus: updated.campus ? { id: updated.campus.id } : undefined
    };
  }

  async updatePassword(userId: string, passwordRaw: string) {
    const id = Number(userId);

    const user = await this.repo.findOne({ where: { id }, withDeleted: false });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const hashed = await bcrypt.hash(passwordRaw, 10);
    user.password = hashed;

    await this.repo.save(user);

    return { message: 'Senha atualizada com sucesso' };
  }

  async delete(userId: string) {
    const id = Number(userId);
    // verifica se o usuário existe sem considerar os deletados
    
    const user = await this.repo.findOne({ where: { id }, withDeleted: false });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    await this.repo.softDelete(userId);

    if (user.role === Role.DOCENTE){
          // evento emitado para deletar turmas daquele docente
          this.eventEmitter.emit(
            'docente.deleted',
            new DocenteDeletedEvent(user.id)
          )
    }

    if (user.role === Role.ALUNO){
          // evento emitado para deletar matriculas daquele aluno
          this.eventEmitter.emit(
            'aluno.deleted',
            new AlunoDeletedEvent(user.id)
          )
    }

    return { message: `Usuário de matrícula "${user.matricula}" removido com sucesso` };
  }
}