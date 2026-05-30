import { ConfigService } from '@nestjs/config';

type EnvReader = Pick<ConfigService, 'get'>;

function readEnv(config: EnvReader, key: string, fallback?: string): string {
  const value = config.get<string>(key);
  return value?.trim() ? value : (fallback ?? '');
}

export function resolveMongoUrl(config: EnvReader): string {
  const explicit =
    readEnv(config, 'MONGO_URI') ||
    readEnv(config, 'MONGO_URL');

  if (explicit) {
    return explicit;
  }

  const user =
    readEnv(config, 'MONGO_ROOT_USERNAME') ||
    readEnv(config, 'MONGO_INITDB_ROOT_USERNAME', 'root');
  const password =
    readEnv(config, 'MONGO_ROOT_PASSWORD') ||
    readEnv(config, 'MONGO_INITDB_ROOT_PASSWORD');
  const database =
    readEnv(config, 'MONGO_DATABASE') ||
    readEnv(config, 'MONGO_INITDB_DATABASE', 'pesquisa_satisfacao');
  const host = readEnv(config, 'MONGO_HOST', 'mongo');
  const port = Number(readEnv(config, 'MONGO_PORT', '27017'));

  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}?authSource=admin`;
}

export function logStartupFromEnv(): void {
  const config = {
    get: <T = string>(key: string, defaultValue?: T) =>
      (process.env[key] as T | undefined) ?? defaultValue,
  };

  const mongoUrl = resolveMongoUrl(config);
  const maskedMongo = mongoUrl.replace(
    /\/\/([^:@/]+):([^@/]+)@/,
    '//$1:***@',
  );

  console.log('Startup config:');
  console.log(`  MySQL: ${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
  console.log(`  Mongo: ${maskedMongo}`);
}
