import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigService {
  get mongoUrl() {
    return process.env.MONGO_URL;
  }

  get jwtSecret() {
    return process.env.JWT_SECRET;
  }
}