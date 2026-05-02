import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigService {
  get mongoUrl(): string | undefined {
    return process.env.MONGO_URL;
  }

  get jwtSecret(): string | undefined {
    return process.env.JWT_SECRET;
  }

  get seedAdminPassword(): string | undefined {
    return process.env.SEED_ADMIN_PASSWORD;
  }
}