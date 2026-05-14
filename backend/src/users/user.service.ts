import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  OnModuleInit, 
  UnauthorizedException,
  BadRequestException
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
import { UpdatePasswordDto } from './dto/update-password.dto';
import { SetorService } from 'src/institutional/setor/setor.service';
import { ServicoService } from 'src/institutional/servico/servico.service';
import { TurmaService } from 'src/academic/turma/turma.service';
import { CursoService } from 'src/academic/curso/curso.service';
import { DisciplinaService } from 'src/academic/disciplina/disciplina.service';

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

    private readonly setorServico: SetorService,

    private readonly servicoService: ServicoService,

    private readonly turmaService: TurmaService,

    private readonly cursoService: CursoService,

    private readonly disciplinaService: DisciplinaService
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
    const password = (passwordEnv && passwordEnv.trim().length >= 6)
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
    const users = await this.repo.find({
      withDeleted: false,
      relations: { campus: true }
    });

    return users?.map(user => ({
      id: user?.id,
      matricula: user?.matricula,
      nome: user?.nome,
      email: user?.email,
      role: user?.role,
      campus: user?.campus?.nome,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt
      })
    )
  }

  async findOne(userId: string | number) {
    const id = Number(userId);

    const user = await this.repo.findOne({
      where: { id },
      relations: { campus: true },
      withDeleted: false
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return {
      id: user.id,
      matricula: user.matricula,
      nome: user.nome,
      email: user.email,
      role: user.role,
      campus: user.campus?.nome ? user.campus?.nome : null
    };
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
    const { avaliacoes, satisfacoes} = await this.pesquisaService.findByAluno(campusId, turmaIds, userId);

    // lista das turmas em que o aluno está matriculado
    const listaMatriculas = matriculas.matriculas;
    
    // mapa para facilitar map no retorno de avaliações
    const turmaMap = new Map(
      listaMatriculas.map(m => [m.turma.id, m.turma])
    );

    // Retorno formatado para o dashboard do Front-end
    return {
      avaliacoesResponder: avaliacoes.length,
      satisfacoesResponder: satisfacoes.length,
      satisfacoes: satisfacoes.map((s) => ({
        id: s.id,
        titulo: s.titulo,
        descricao: s.descricao,
        dataInicio: s.dataInicio,
        dataFinal: s.dataFinal,
      })),
      avaliacoes: avaliacoes.map((a) => {
      // busca os dados da turma no map usando o tipoId da pesquisa
      const dadosTurma = turmaMap.get(a.tipoId);

      return {
        id: a.id,
        titulo: a.titulo,
        descricao: a.descricao,
        dataInicio: a.dataInicio,
        dataFinal: a.dataFinal,
        disciplina: dadosTurma?.disciplina?.nome || 'Disciplina não encontrada',
        docente: dadosTurma?.docente?.nome || 'Docente não informado',
        turmaId: a.tipoId,
        turno: dadosTurma?.turno
      };
    })
  }
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
  async getDashboardGestor(campusId: number) {
    const { avaliacoesDocente, filteredSatisfacao } = await this.pesquisaService.findByGestor(campusId);

    return {
      avaliacoesDocente,
      filteredSatisfacao
    };
  }

      // DASHBOARD GESTOR
  async getDashboardAdmin() {
    // info de institutional
    const campus = await this.campusService.findAll();

    const setores = await this.setorServico.findAll();

    const servicos = await this.servicoService.findAll();

    // info de academic
    const cursos = await this.cursoService.findAll();

    const periodos = await this.periodoService.findAll();

    const disciplinas = await this.disciplinaService.findAll();

    const turmas = await this.turmaService.findAllResumo();

    const matriculas = await this.matriculaService.findAllAdmin();

    // usuarios
    const users = await this.repo.find({
      relations: { campus: true},
      withDeleted: false
    });

    return {
      resumo: {
        users: {
          total: users.length,
          admins: users.filter((u) => u.role === Role.ADMIN).length,
          gestores: users.filter((u) => u.role === Role.GESTOR).length,
          docentes: users.filter((u) => u.role === Role.DOCENTE).length,
          alunos: users.filter((u) => u.role === Role.ALUNO).length,
        },
        institutional: {
          campi: campus.length,
          setores: setores.length,
          servicos: servicos.length
        },
        academic: {
          cursos: cursos.length,
          disciplinas: disciplinas.length,
          turmas: turmas.length,
          periodos: periodos.length,
          matriculas: matriculas.length
        }
      },
      institutional: {
        campus,
        setores,
        servicos
      },
      academic: {
        cursos,
        disciplinas,
        turmas,
        periodos,
        matriculas
      },
      users: users.map((u) => ({
        id: u.id,
        matricula: u.matricula,
        nome: u.nome,
        role: u.role,
        email: u.email,
        campusId: u.campus?.id,
        campus: u.campus?.nome 
      }))
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

  async updatePassword(updatePasswordDto: UpdatePasswordDto, userId: number) {

    const user = await this.repo.findOne({ where: { id: userId }, withDeleted: false });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    // verificar a senha atual do usuário
    const check = await bcrypt.compare(updatePasswordDto.passwordAtual, user.password);

    if (!check) throw new UnauthorizedException("Senha atual incorreta!")

    if (updatePasswordDto.password === updatePasswordDto.passwordAtual) throw new BadRequestException("A senha nova não pode ser igual à atual.")

    // segue para trocar a senha do usuário
    const hashed = await bcrypt.hash(updatePasswordDto.password, 10);

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