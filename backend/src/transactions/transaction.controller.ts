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
import { TransactionsService } from './transaction.service';
import { PaymentService } from './payment.service';
import { Transaction } from './transaction.model';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CardTokenizationDto } from './dto/card-tokenization.dto';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get()
  findAll(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Transaction> {
    return this.transactionsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionsService.create(createTransactionDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() transactionData: Partial<Transaction>,
  ) {
    return this.transactionsService.update(id, transactionData);
  }

  @Post('tokenize')
  @HttpCode(HttpStatus.CREATED)
  tokenizeCard(
    @Body() cardTokenizationDto: CardTokenizationDto,
  ): Observable<AxiosResponse> {
    return this.paymentService.cardTokenization(cardTokenizationDto);
  }
}
