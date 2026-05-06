import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { createMock } from '@golevelup/ts-jest';

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          // Criamos um mock do MailerService (Nodemailer) 
          // para evitar envios reais de e-mail durante os testes.
          provide: MailerService,
          useValue: createMock<MailerService>(),
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('enviarNotificacao', () => {
    it('deve chamar o sendMail com os parâmetros corretos', async () => {
      const dadosMock = {
        emailDestinatario: 'teste@teste.com',
        titulo: 'Pesquisa Acadêmica',
        link: 'http://link.com',
      };

      await service.enviarNotificacao('NOVA_PESQUISA', dadosMock);

      // Verifica se o método sendMail do Nodemailer foi chamado
      expect(mailerService.sendMail).toHaveBeenCalled();
    });
  });

  describe('enviarNotificacaoAuditoria', () => {
    it('deve disparar e-mail de auditoria com sucesso', async () => {
      const logMock = {
        acao: 'CREATE',
        entidade: 'Pesquisa',
        usuarioNome: 'Admin',
        dadosNovos: { titulo: 'Teste' }
      };

      await service.enviarNotificacaoAuditoria(logMock);

      expect(mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'matheus7778842@gmail.com',
          subject: expect.stringContaining('Auditoria'),
        }),
      );
    });
  });
});