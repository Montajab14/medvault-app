import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // HSTS (force HTTPS for 180 days). En dev, si tu n'as pas HTTPS, adapte la durée.
  app.use(
    helmet.hsts({
      maxAge: 15552000, // 180 days in seconds
      includeSubDomains: true,
      preload: true,
    }),
  );

  // CORS : whitelist (adapte les URLs pour prod)
  const allowedOrigins = [
    'http://localhost:5173', // frontend en dev (Vite)
    'http://localhost:3000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // allow requests with no origin (like curl, mobile clients)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin as string) !== -1) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  // Validation global (déjà activée ailleurs, on s'assure ici)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Rate limiter pour routes d'auth (protection brute-force)
  const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, 
    message: {
      statusCode: 429,
      message: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Applique uniquement aux routes commençant par /auth
  app.use('/auth', authLimiter);

  await app.listen(3000);
}
bootstrap();
