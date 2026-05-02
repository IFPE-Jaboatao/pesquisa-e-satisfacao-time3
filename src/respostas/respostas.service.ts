import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

import { Resposta } from './entities/resposta.entity';
import { Pesquisa } from '../pesquisas/entities/pesquisa.entity';
import { EnviarRespostaDto } from './dto/enviar-resposta.dto';

@Injectable()
export class RespostasService {
  constructor(
    @InjectRepository(Resposta, 'mongo')
    private readonly repo: MongoRepository<Resposta>,

    @InjectRepository(Pesquisa, 'mongo')
    private readonly pesquisaRepo: MongoRepository<Pesquisa>,
  ) {}

  /**
   * Registra a resposta vinculando ao ID numérico do aluno (proveniente do MySQL/JWT).
   */
  async registrarIdentificado(dto: EnviarRespostaDto, alunoId: any) {
    // 1. Validação preventiva de identidade
    if (alunoId === undefined || alunoId === null) {
      throw new BadRequestException('Identificação do aluno ausente.');
    }

    // Normalização para garantir que o MongoDB compare os tipos corretos
    const pesquisaIdNormalizada = dto.pesquisaId.toString();
    const alunoIdNumerico = Number(alunoId);

    if (isNaN(alunoIdNumerico)) {
      throw new BadRequestException('ID do aluno em formato inválido.');
    }

    // 2. Valida se a pesquisa existe, está publicada e dentro do prazo
    await this.validarPesquisaEPrazo(pesquisaIdNormalizada);

    // 3. Verificação de Duplicidade
    // Busca um registro que combine exatamente a pesquisa E o aluno
    const jaRespondeu = await this.repo.findOne({
      where: {
        pesquisaId: pesquisaIdNormalizada,
        alunoId: alunoIdNumerico,
      },
    });

    if (jaRespondeu) {
      throw new ConflictException(
        `O aluno (ID: ${alunoIdNumerico}) já enviou uma resposta para esta avaliação.`
      );
    }

    // 4. Persistência dos dados
    const novaResposta = this.repo.create({
      pesquisaId: pesquisaIdNormalizada,
      respostas: dto.respostas,
      alunoId: alunoIdNumerico,
      enviadoEm: new Date(),
    });

    return await this.repo.save(novaResposta);
  }

  /**
   * Encapsula toda a lógica de validação de estado e tempo da pesquisa.
   */
  private async validarPesquisaEPrazo(pesquisaId: string): Promise<Pesquisa> {
    if (!ObjectId.isValid(pesquisaId)) {
      throw new BadRequestException('ID da pesquisa possui formato inválido.');
    }

    const pesquisa = await this.pesquisaRepo.findOne({
      where: { _id: new ObjectId(pesquisaId) } as any,
    });

    if (!pesquisa) {
      throw new NotFoundException('A pesquisa solicitada não foi encontrada.');
    }

    if (!pesquisa.publicada) {
      throw new ForbiddenException('Esta pesquisa ainda não está aberta para participação.');
    }

    const agora = new Date();
    const dataInicio = new Date(pesquisa.dataInicio);
    const dataFinal = new Date(pesquisa.dataFinal);

    // Verifica se as datas no banco são válidas
    if (isNaN(dataInicio.getTime()) || isNaN(dataFinal.getTime())) {
      throw new BadRequestException('Erro na configuração de datas da pesquisa.');
    }

    if (agora < dataInicio) {
      throw new ForbiddenException({
        error: 'Prazo não iniciado',
        message: `Esta avaliação estará disponível apenas em ${dataInicio.toLocaleString()}`,
      });
    }

    if (agora > dataFinal) {
      throw new ForbiddenException({
        error: 'Prazo encerrado',
        message: `O período de participação encerrou em ${dataFinal.toLocaleString()}`,
      });
    }

    return pesquisa;
  }

  /**
   * Gera o relatório de respostas para uma pesquisa específica.
   */
  async relatorio(pesquisaId: string) {
    if (!ObjectId.isValid(pesquisaId)) {
      throw new BadRequestException('ID da pesquisa inválido para relatório.');
    }

    return await this.repo.find({
      where: { pesquisaId: pesquisaId.toString() },
      order: { enviadoEm: 'DESC' },
    });
  }
}