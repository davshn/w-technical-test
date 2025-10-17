import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TransactionsService } from './transaction.service';
import { PaymentService } from './payment.service';
import { Transaction } from './transaction.model';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CardTokenizationDto } from './dto/card-tokenization.dto';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todas las transacciones',
    description:
      'Obtiene el historial completo de transacciones con sus productos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de transacciones obtenida exitosamente',
    type: [Transaction],
  })
  findAll(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }

  @Get('aceptance')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiTags('payments')
  @ApiOperation({
    summary: 'Obtener token de aceptación',
    description:
      'Genera el token de aceptación de términos y condiciones requerido para crear transacciones',
  })
  @ApiResponse({
    status: 202,
    description: 'Token de aceptación generado',
    schema: {
      example: {
        presigned_acceptance: {
          acceptance_token:
            'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6NTA3LCJwZXJtYWxpbmsiOiJodHRwczovL3dvbXBpLmNvbS9hc3NldHMvZG93bmxvYWRibGUvcmVnbGFtZW50by1Vc3Vhcmlvcy1Db2xvbWJpYS5wZGYiLCJmaWxlX2hhc2giOiJkYzJkNGUzMDVlNGQzNmFhYjhjYzU3N2I1YTY5Nzg1MSIsImppdCI6IjE3NjA2Njc3MTktODE4NzMiLCJlbWFpbCI6IiIsImV4cCI6MTc2MDY3MTMxOX0.VlyxJwMzM4U85CvUncCpxNznswNSzYtJtnYWC7wYxR8',
          permalink:
            'https://wompi.com/assets/downloadble/reglamento-Usuarios-Colombia.pdf',
          type: 'END_USER_POLICY',
        },
      },
    },
  })
  async generateAceptanceTokens(): Promise<{
    presigned_acceptance: string;
  }> {
    return await this.paymentService.generateAceptanceTokens();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener transacción por ID',
    description: 'Consulta los detalles de una transacción específica',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la transacción',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Transacción encontrada',
    type: Transaction,
  })
  @ApiResponse({
    status: 404,
    description: 'Transacción no encontrada',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Transaction> {
    return this.transactionsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear nueva transacción',
    description:
      'Procesa una nueva compra:\n' +
      '1. Valida productos y stock\n' +
      '2. Calcula el total\n' +
      '3. Procesa el pago con el token de tarjeta\n' +
      '4. Registra la transacción',
  })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transacción creada y pago procesado exitosamente',
    schema: {
      example: [
        {
          id: 'c11fe869-29f0-4cab-a532-d6deb2516f96',
          status: 'ASSIGNED',
          transactionDate: '2025-10-17T02:09:57.665Z',
          customer: 'cliente@ejemplo.com',
          total: 1700000,
          paymentId: '15113-1760666998-38779',
          products: [
            {
              id: 1,
              name: 'Cafetera Nespresso Vertuo Next',
              uri: 'https://example.com/images/cafetera-nespresso-vertuo.jpg',
              description:
                'Cafetera automática para cápsulas Vertuo con sistema de extracción por centrifusión.',
              quantity: 8,
              value: 850000,
              TransactionProduct: {
                quantity: 2,
              },
            },
          ],
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o producto sin stock',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionsService.create(createTransactionDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Validar y finalizar transacción',
    description:
      'Valida el estado del pago y actualiza el inventario:\n' +
      '1. Consulta el estado en el proveedor de pagos\n' +
      '2. Si está aprobado, descuenta del stock\n' +
      '3. Actualiza el estado a ASSIGNED',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la transacción',
  })
  @ApiResponse({
    status: 200,
    description: 'Transacción validada y finalizada',
    type: Transaction,
  })
  @ApiResponse({
    status: 400,
    description: 'Pago no aprobado o sin stock suficiente',
  })
  update(@Param('id', ParseUUIDPipe) id: string) {
    return this.transactionsService.update(id);
  }

  @Post('tokenize')
  @HttpCode(HttpStatus.CREATED)
  @ApiTags('payments')
  @ApiOperation({
    summary: 'Tokenizar tarjeta de crédito',
    description:
      'Convierte los datos de tarjeta en un token seguro para pagos:\n' +
      '- Solo acepta Visa y Mastercard\n' +
      '- Valida número con algoritmo de Luhn\n' +
      '- Verifica fecha de expiración\n' +
      '- NO almacena datos sensibles',
  })
  @ApiBody({
    type: CardTokenizationDto,
    examples: {
      visa: {
        summary: 'Tarjeta Visa',
        value: {
          number: '4111111111111111',
          cvc: '123',
          exp_month: '12',
          exp_year: '25',
          card_holder: 'JOHN DOE',
        },
      },
      mastercard: {
        summary: 'Tarjeta Mastercard',
        value: {
          number: '5555555555554444',
          cvc: '456',
          exp_month: '06',
          exp_year: '26',
          card_holder: 'JANE SMITH',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Token generado exitosamente',
    schema: {
      example: {
        status: 'CREATED',
        data: {
          id: 'tok_test_12345_ABCDE12345FGHIJ67890',
          created_at: '2024-01-15T10:30:00.000Z',
          brand: 'VISA',
          name: 'JOHN DOE',
          last_four: '1111',
          bin: '411111',
          exp_year: '25',
          exp_month: '12',
          card_holder: 'JOHN DOE',
          expires_at: '2025-12-31T23:59:59.000Z',
          validity_ends_at: '2025-12-31T23:59:59.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de tarjeta inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Número de tarjeta inválido',
          'Solo se aceptan tarjetas Visa o Mastercard',
          'CVV inválido (debe tener 3 o 4 dígitos)',
          'La tarjeta está vencida',
        ],
        error: 'Bad Request',
      },
    },
  })
  cardTokenice(
    @Body() cardTokenizationDto: CardTokenizationDto,
  ): Observable<AxiosResponse> {
    return this.paymentService.cardTokenice(cardTokenizationDto);
  }
}
