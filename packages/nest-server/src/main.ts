import 'reflect-metadata';

console.log('Nest startup: loading application modules');
const [
  { ValidationPipe },
  { NestFactory },
  { default: cookieParser },
  { AppModule },
] = await Promise.all([
  import('@nestjs/common/pipes/index.js'),
  import('@nestjs/core'),
  import('cookie-parser'),
  import('./app.module.ts'),
]);

async function bootstrap() {
  console.log('Nest startup: initializing application and database');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: [/^http:\/\/127\.0\.0\.1(:\d+)?$/, /^http:\/\/localhost(:\d+)?$/],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
  console.log('Nest startup: application listening');
}
try {
  await bootstrap();
} catch (error) {
  console.error('Nest startup failed:', error);
  throw error;
}
