import 'reflect-metadata';

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
  const app = await NestFactory.create(AppModule);
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
await bootstrap();
