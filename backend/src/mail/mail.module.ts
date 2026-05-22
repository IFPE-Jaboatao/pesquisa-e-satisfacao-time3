import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule, 
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: AppConfigService) => ({
        transport: {
          host: config.mailHost,
          port: config.mailPort,
          secure: config.mailPort === 465,
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
  exports: [MailService], // Exportação mantida para uso no PesquisasModule/CronService
})
export class MailModule {}