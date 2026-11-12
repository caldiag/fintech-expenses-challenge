import 'reflect-metadata';

async function bootstrap() {
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

  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    logger: ['error', 'warn'],
  });
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
}
void bootstrap().catch((error: unknown) => {
  console.error('Nest startup failed:', error);
  process.exitCode = 1;
});
