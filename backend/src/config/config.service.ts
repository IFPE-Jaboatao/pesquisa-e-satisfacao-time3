import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigService {
  // --- Configurações de Banco e Segurança ---
  
  get mongoUrl(): string | undefined {
    return process.env.MONGO_URL;
  }

  get jwtSecret(): string | undefined {
    return process.env.JWT_SECRET;
  }

  get seedAdminPassword(): string | undefined {
    return process.env.SEED_ADMIN_PASSWORD;
  }

  // --- Configurações de E-mail (Nodemailer) ---
  // Estas propriedades resolvem os erros de "Property does not exist" no MailModule

  get mailHost(): string {
    // Retorna o host do SMTP ou o padrão do Gmail caso não esteja no .env
    return process.env.MAIL_HOST || 'smtp.gmail.com';
  }

  get mailPort(): number {
    // Converte a porta para número, padrão 465 para SSL
    return Number(process.env.MAIL_PORT) || 465;
  }

  get mailUser(): string | undefined {
    return process.env.MAIL_USER;
  }

  get mailPass(): string | undefined {
    return process.env.MAIL_PASS;
  }

  get mailFrom(): string {
    // Define o nome que aparecerá como remetente no e-mail
    return process.env.MAIL_FROM || '"Survey System | IFPE" <seu-email@gmail.com>';
  }
}