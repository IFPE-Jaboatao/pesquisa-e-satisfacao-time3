import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MongoRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

// Imports dos Enums e Entidades
import { User } from '../users/user.entity';
import { Setor } from '../institutional/setor/entities/setor.entity';
import { Role } from '../users/user-role.enum';
import { Turnos } from '../academic/turma/turma-turnos.enum';
import { Tipo } from '../pesquisas/pesquisa-tipo.enum';
import { TipoQuestao, Questao } from '../questoes/entities/questao.entity'; // <-- ATUALIZADO: Importado Questao
import { Pesquisa } from '../pesquisas/entities/pesquisa.entity';
import { Resposta } from '../respostas/entities/resposta.entity';

// Imports de Serviços do Sistema
import { CampusService } from '../institutional/campus/campus.service';
import { PeriodoService } from '../academic/periodo/periodo.service';
import { MatriculaService } from '../academic/matricula/matricula.service';
import { CursoService } from '../academic/curso/curso.service';
import { DisciplinaService } from '../academic/disciplina/disciplina.service';
import { TurmaService } from '../academic/turma/turma.service';
import { ServicoService } from '../institutional/servico/servico.service';

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User, 'mysql')
    private readonly userRepo: Repository<User>,
    @InjectRepository(Setor, 'mysql')
    private readonly setorRepo: Repository<Setor>,
    @InjectRepository(Pesquisa, 'mongo')
    private readonly pesquisaRepo: MongoRepository<Pesquisa>,
    @InjectRepository(Questao, 'mongo')
    private readonly questaoRepo: MongoRepository<Questao>, // <-- ADICIONADO: Repositório de Questões
    @InjectRepository(Resposta, 'mongo')
    private readonly respostaRepo: MongoRepository<Resposta>,
    
    private readonly campusService: CampusService,
    private readonly periodoService: PeriodoService,
    private readonly matriculaService: MatriculaService,
    private readonly cursoService: CursoService,
    private readonly disciplinaService: DisciplinaService,
    private readonly turmaService: TurmaService,
    private readonly servicoService: ServicoService,
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
      console.log(`📢 Ambiente "${process.env.NODE_ENV}" detectado! Iniciando setup completo multicluster...`);
      await this.executarCargaDemonstracao();
    }
  }

  private async executarCargaDemonstracao() {
    try {
      const emailRef = 'aluno.teste1@ifpe.edu.br';
      const dadosJaExistem = await this.userRepo.findOne({ where: { email: emailRef } });
      
      if (dadosJaExistem) {
        console.log('⚠️ Dados de demonstração já existem no MySQL. Pulando inserção global.');
        return;
      }

      console.log('🌱 [1/5] Gerando infraestrutura de Campus, Setores e Serviços...');
      const campus = await this.campusService.create({ nome: 'Campus Jaboatão dos Guararapes' });

      const setorAcademico = await this.setorRepo.save(this.setorRepo.create({
        nome: 'Coordenação Acadêmica',
        campus: { id: campus.id }
      }));

      const servicoBiblioteca = await this.servicoService.create({
        nome: 'Biblioteca Central',
        setorId: setorAcademico.id 
      });

      console.log('🌱 [2/5] Gerando Cursos, Disciplinas e Períodos Acadêmicos...');
      const cursoADS = await this.cursoService.create({ nome: 'Análise e Desenvolvimento de Sistemas', campusId: campus.id });
      const disciplinaNest = await this.disciplinaService.create({
        nome: 'Desenvolvimento Web com NestJS',
        cursoId: cursoADS.id,
        codigo: 'ADS-NEST-2026'
      });

      const periodo = await this.periodoService.create({ 
        ano: 2026, semestre: 1,
        startDate: '2026-02-01', endDate: '2026-06-30'
      });

      console.log('🌱 [3/5] Gerando amostragem de contas de usuários...');
      const senhaPadrao = await bcrypt.hash('demo123', 10);

      const docente1 = await this.userRepo.save(this.userRepo.create({
        matricula: '20261002DOCENTE', nome: 'Professor de Teste',
        email: 'docente.teste@ifpe.edu.br', password: senhaPadrao,
        role: Role.DOCENTE, campus: { id: campus.id }
      }));

      const infoAlunos = [
        { n: 'André Silva', e: 'aluno.teste1@ifpe.edu.br', m: '20261001AL' },
        { n: 'Beatriz Santos', e: 'aluno.teste2@ifpe.edu.br', m: '20261002AL' },
        { n: 'Carlos Oliveira', e: 'aluno.teste3@ifpe.edu.br', m: '20261003AL' }
      ];

      const alunosGerados: User[] = []; 
      for (const item of infoAlunos) {
        const aluno = await this.userRepo.save(this.userRepo.create({
          matricula: item.m, nome: item.n, email: item.e, password: senhaPadrao,
          role: Role.ALUNO, campus: { id: campus.id }
        }));
        alunosGerados.push(aluno);
      }

      console.log('🌱 [4/5] Montando turmas acadêmicas e vinculando matrículas...');
      const turmaNest = await this.turmaService.create({
        turno: Turnos.NOITE, disciplinaId: disciplinaNest.id,
        periodoId: periodo.id, docenteId: docente1.id
      });

      for (const aluno of alunosGerados) {
        await this.matriculaService.create({ alunoId: aluno.id, turmaId: turmaNest.id });
      }

      console.log('🌱 [5/5] Forçando criação de Questões e Pesquisa no MongoDB...');
      
      const dataHoje = new Date();
      const qMultId = new ObjectId();
      const qEscaId = new ObjectId();
      const qAberId = new ObjectId();

      // 1. SALVANDO AS QUESTÕES INDEPENDENTES NA COLEÇÃO "QUESTOES"
      const dadosQuestoes = [
        { _id: qMultId, pergunta: 'Acervo da biblioteca?', tipo: TipoQuestao.MULTIPLA, opcoes: ['Excelente', 'Bom', 'Regular'] },
        { _id: qEscaId, pergunta: 'Satisfação com atendimento (1 a 5)?', tipo: TipoQuestao.ESCALA, opcoes: ['1','2','3','4','5'] },
        { _id: qAberId, pergunta: 'Sugestões de melhoria:', tipo: TipoQuestao.ABERTA, opcoes: [] }
      ];

      for (const q of dadosQuestoes) {
        await this.questaoRepo.save(this.questaoRepo.create(q as any));
      }
      console.log('   🔹 Coleção "questoes" populada com sucesso!');

      // 2. SALVANDO A PESQUISA VINCULANDO O ARRAY DE QUESTÕES FORMATADO
      const novaPesquisa = {
        titulo: 'Avaliação de Infraestrutura - Biblioteca',
        descricao: 'Coleta de métricas sobre o espaço e acervo da biblioteca.',
        dataInicio: dataHoje.toISOString(), 
        dataFinal: '2027-12-31T23:59:59Z',
        servicoId: servicoBiblioteca.id,
        campusId: campus.id,
        publicada: true,
        encerrada: false,
        tipo: Tipo.SATISFACAO,
        questoes: dadosQuestoes // O documento da pesquisa leva o array completo com IDs idênticos
      };

      const pesquisaSalva: any = await this.pesquisaRepo.save(this.pesquisaRepo.create(novaPesquisa as any));
      const pId = (pesquisaSalva._id || pesquisaSalva.id).toString();

      console.log(`✅ Pesquisa criada com sucesso direta no Mongo! ID: ${pId}`);
      console.log(`🚀 Iniciando gravação de respostas para ${alunosGerados.length} alunos...`);

      const mocks = [
        { m: 'Excelente', e: '5', a: 'Ótimo atendimento!' },
        { m: 'Bom', e: '4', a: 'Poderia ter mais tomadas.' },
        { m: 'Regular', e: '3', a: 'O Wi-fi oscila muito.' }
      ];

      for (let i = 0; i < alunosGerados.length; i++) {
        try {
          const respostaDocumento = this.respostaRepo.create({
            pesquisaId: pId,
            alunoId: Number(alunosGerados[i].id),
            enviadoEm: new Date(),
            respostas: [
              { questaoId: qMultId.toString(), valor: mocks[i].m },
              { questaoId: qEscaId.toString(), valor: mocks[i].e },
              { questaoId: qAberId.toString(), valor: mocks[i].a }
            ]
          } as any);

          const respostaSalva: any = await this.respostaRepo.save(respostaDocumento);
          console.log(`   👉 [RESPOSTA SALVA] Aluno: ${alunosGerados[i].nome} | ID Resposta: ${respostaSalva._id || respostaSalva.id}`);
        } catch (errorMongo: any) {
          console.error(`❌ Erro ao salvar resposta do aluno ${alunosGerados[i].nome}:`, errorMongo.message);
        }
      }

      console.log('🎉 [SUCESSO] Script de Seed executado por completo!');
    } catch (error: any) {
      console.error('❌ Erro crítico no seed de demonstração:', error.message);
    }
  }
}