import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';
import { MailService } from './mail.service';

@Module({
  imports: [
    // Importamos o seu ConfigModule para ter acesso aos getters do AppConfigService
    ConfigModule, 
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: AppConfigService) => ({
        transport: {
          host: config.mailHost,
          port: config.mailPort,
          secure: config.mailPort === 465, // Dinâmico: true para 465, false para outras
          auth: {
            user: config.mailUser,
            pass: config.mailPass,
          },
        },
        defaults: {
          from: config.mailFrom,
        },
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService], // Essencial para resolver o erro de dependência no NotificacoesService
})
export class MailModule {}