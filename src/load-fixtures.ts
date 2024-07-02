import { NestFactory } from '@nestjs/core';
import { FixturesModule } from './fixtures/fixtures.module';
import { FixturesService } from './fixtures/fixtures.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(FixturesModule);
  const fixturesService = appContext.get(FixturesService);
  await fixturesService.insertFixtures();
  await appContext.close();
}

bootstrap().catch(console.error);
