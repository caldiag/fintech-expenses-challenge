import { CommandFactory } from 'nest-commander';
import { CommandModule } from './command/command.module.ts';

async function bootstrap() {
  await CommandFactory.run(CommandModule, ['warn', 'error']);
}

bootstrap();
