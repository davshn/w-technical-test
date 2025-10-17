import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('API de E-commerce con Pagos')
    .setDescription(
      'API completa para gestión de productos, transacciones y procesamiento de pagos con tarjetas de crédito.\n\n' +
        '## Características\n' +
        '- Gestión de inventario de productos\n' +
        '- Procesamiento de transacciones\n' +
        '- Tokenización segura de tarjetas (Visa/Mastercard)\n' +
        '- Validación de pagos\n' +
        '- Control de stock\n\n' +
        '## Flujo de compra\n' +
        '1. Obtener acceptance token\n' +
        '2. Tokenizar tarjeta del cliente\n' +
        '3. Crear transacción con productos\n' +
        '4. Validar y finalizar transacción',
    )
    .setVersion('1.0')
    .setContact(
      'Equipo de Desarrollo',
      'https://tuempresa.com',
      'dev@tuempresa.com',
    )
    .addTag('products', 'Gestión de productos del inventario')
    .addTag('transactions', 'Gestión de transacciones de compra')
    .addTag('payments', 'Procesamiento y tokenización de pagos')
    .addServer('http://localhost:3000', 'Desarrollo')
    .addServer('https://api.tuempresa.com', 'Producción')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'API E-commerce - Documentación',
  });
  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 Application is running on: http://localhost:3000');
  console.log('📚 Swagger docs available at: http://localhost:3000/api/docs');
}
bootstrap();
