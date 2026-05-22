import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DatabaseSeedService } from './database-seed.service';
import { SeedModule } from './seed.module';

async function bootstrap() {
  process.env.NODE_ENV = 'development';
  
  console.log('🚀 Inicializando contexto integrado (AppModule) para o Seed CLI...');

  const imports = Reflect.getMetadata('imports', AppModule) || [];
  if (!imports.includes(SeedModule)) {
    imports.push(SeedModule);
    Reflect.defineMetadata('imports', imports, AppModule);
  }

  // Desativamos os hooks de shutdown automáticos do Nest para evitar o conflito do TypeORM multicluster
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });
  
  const seedService = app.get(DatabaseSeedService);

  try {
    console.log('⚡ Conexões e Eventos estabelecidos com sucesso! Executando carga de demonstração...');
    await seedService.onModuleInit();
    
    console.log('🔒 Carga finalizada com sucesso! Encerrando processo CLI de forma limpa...');
    // Forçamos a saída com sucesso direto aqui para evitar que o hook de shutdown do TypeORM quebre
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro durante a execução do Seed CLI:', error.message);
    process.exit(1);
  }
}

bootstrap();