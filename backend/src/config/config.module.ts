import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './config.service';

@Global()
@Module({
  providers: [AppConfigService],
  exports: [AppConfigService], // Exporta para que o MailModule e outros vejam os getters
})
export class ConfigModule {} // Alterado de ConfigCustomModule para ConfigModule