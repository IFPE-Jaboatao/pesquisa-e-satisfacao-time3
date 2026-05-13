import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Imports dos Enums e Entidades necessários
import { User } from '../users/user.entity';
import { Setor } from '../institutional/setor/entities/setor.entity'; // <-- ADICIONADO: Entidade Setor
import { Role } from '../users/user-role.enum';
import { Turnos } from '../academic/turma/turma-turnos.enum';
import { Tipo } from '../pesquisas/pesquisa-tipo.enum';
import { TipoQuestao } from '../questoes/entities/questao.entity';

// Imports de Serviços do Sistema
import { CampusService } from '../institutional/campus/campus.service';
import { PeriodoService } from '../academic/periodo/periodo.service';
import { MatriculaService } from '../academic/matricula/matricula.service';
import { PesquisasService } from '../pesquisas/pesquisas.service';

// Serviços Acadêmicos e Institucionais adicionais
import { CursoService } from '../academic/curso/curso.service';
import { DisciplinaService } from '../academic/disciplina/disciplina.service';
import { TurmaService } from '../academic/turma/turma.service';
import { ServicoService } from '../institutional/servico/servico.service';

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User, 'mysql')
    private readonly userRepo: Repository<User>,
    @InjectRepository(Setor, 'mysql') // <-- ADICIONADO: Injeção do repositório do Setor
    private readonly setorRepo: Repository<Setor>,
    
    private readonly campusService: CampusService,
    private readonly periodoService: PeriodoService,
    private readonly matriculaService: MatriculaService,
    private readonly pesquisaService: PesquisasService,
    
    private readonly cursoService: CursoService,
    private readonly disciplinaService: DisciplinaService,
    private readonly turmaService: TurmaService,
    private readonly servicoService: ServicoService,
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'test') {
      console.log('📢 Ambiente "test" detectado! Iniciando setup de dados para demonstração...');
      await this.executarCargaDemonstracao();
    }
  }

  private async executarCargaDemonstracao() {
    try {
      // Evita duplicidade ao reiniciar o servidor NestJS
      const dadosJaExistem = await this.userRepo.findOne({ where: { email: 'aluno.demo@ifpe.edu.br' } });
      if (dadosJaExistem) {
        console.log('⚠️ Dados de demonstração já existem no banco. Pulando inserção.');
        return;
      }

      console.log('🌱 [1/5] Gerando massa institucional base...');
      
      // 1. Criar o Setor fisicamente no MySQL antes para o serviço não lançar exceção
      const setor = await this.setorRepo.save(this.setorRepo.create({
        nome: 'Coordenação Acadêmica'
      }));

      // 2. Criar Campus e Serviço Institucional vinculando dinamicamente ao setor criado
      const campus = await this.campusService.create({ 
        nome: 'Campus Jaboatão dos Guararapes' 
      });

      const servico = await this.servicoService.create({
        nome: 'Biblioteca Central',
        setorId: setor.id // <-- ATUALIZADO: Usando o ID dinâmico do setor real
      });

      console.log('🌱 [2/5] Gerando infraestrutura acadêmica...');

      // 2. Criar Curso e Disciplina vinculada
      const curso = await this.cursoService.create({
        nome: 'Análise e Desenvolvimento de Sistemas',
        campusId: campus.id
      });

      const disciplina = await this.disciplinaService.create({
        nome: 'Desenvolvimento Web com NestJS',
        cursoId: curso.id,
        codigo: 'ADS-NEST-2026'
      });

      // 3. Criar Período Acadêmico
      const periodo = await this.periodoService.create({ 
        ano: 2026,
        semestre: 1,
        startDate: '2026-02-01',
        endDate: '2026-06-30'
      });

      console.log('🌱 [3/5] Gerando contas de usuários para a apresentação...');

      // 4. Criar Usuários de Teste (Aluno e Docente) com senhas criptografadas
      const senhaPadrao = await bcrypt.hash('demo123', 10);

      const aluno = await this.userRepo.save(this.userRepo.create({
        matricula: '20261001ALUNO',
        nome: 'Matheus Aluno Demo',
        email: 'aluno.demo@ifpe.edu.br',
        password: senhaPadrao,
        role: Role.ALUNO,
        campus: { id: campus.id }
      }));

      const docente = await this.userRepo.save(this.userRepo.create({
        matricula: '20261002DOCENTE',
        nome: 'Professor Demo',
        email: 'docente.demo@ifpe.edu.br',
        password: senhaPadrao,
        role: Role.DOCENTE,
        campus: { id: campus.id }
      }));

      console.log('🌱 [4/5] Vinculando turmas e matrículas...');

      // 5. Criar Turma unificando Disciplina, Período e o Docente criado
      const turma = await this.turmaService.create({
        turno: Turnos.NOITE,
        disciplinaId: disciplina.id,
        periodoId: periodo.id,
        docenteId: docente.id
      });

      // 6. Matricular o aluno na turma criada usando a estrutura exata do CreateMatriculaDto recebido
      await this.matriculaService.create({
        alunoId: aluno.id,
        turmaId: turma.id
      });

      console.log('🌱 [5/5] Publicando formulários de pesquisas...');

      // Captura de forma robusta e dinâmica os tipos válidos do enum da sua equipe
      const chavesEnumQuestao = Object.values(TipoQuestao);
      const tipoMultipla = chavesEnumQuestao.find(t => String(t).toUpperCase().includes('MULT')) as TipoQuestao || chavesEnumQuestao[0] as TipoQuestao;

      // Cria a string de data baseada no fuso horário local, evitando discrepâncias do UTC puro
      const d = new Date();
      const ano = d.getFullYear();
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const dia = String(d.getDate()).padStart(2, '0');
      const hojeLocalStr = `${ano}-${mes}-${dia}`;

      // 7. Criar Pesquisa de Satisfação (Garante conformidade estrita com o CreateQuestaoParcialDto)
      await this.pesquisaService.createSatisfacao({
        titulo: 'Avaliação de Infraestrutura - Biblioteca',
        descricao: 'Pesquisa destinada a coletar feedback sobre o acervo e espaço da biblioteca.',
        dataInicio: hojeLocalStr, // <-- ATUALIZADO: Strings seguras com a data do sistema local
        dataFinal: '2026-06-30',
        servicoId: servico.id,
        publicada: true,
        questoes: [
          { 
            pergunta: 'Como você avalia o atendimento da biblioteca?', 
            tipo: tipoMultipla,
            opcoes: ['Excelente', 'Bom', 'Regular', 'Ruim']
          }
        ]
      }, campus.id);

      // 8. Criar Pesquisa de Avaliação Docente usando a assinatura auditada detectada
      const tipoAvaliacaoValido = Object.values(Tipo).find(t => String(t).toUpperCase().includes('AVAL')) as Tipo || Object.values(Tipo)[0] as Tipo;

      await this.pesquisaService.create({
        titulo: `Avaliação Docente - ${disciplina.nome}`,
        dataInicio: hojeLocalStr, // <-- ATUALIZADO: Strings seguras com a data do sistema local
        dataFinal: '2026-06-30',
        tipo: tipoAvaliacaoValido, 
        tipoId: turma.id,             
        publicada: true
      }, docente); // Passando o objeto de usuário completo conforme a assinatura do seu service requer para auditoria

      console.log('🎉 [SUCESSO] O ecossistema completo foi populado de forma limpa e segura!');
    } catch (error: any) {
      console.error('❌ Erro crítico no seed de demonstração:', error.message);
    }
  }
}