import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { CardTokenizationDto } from './dto/card-tokenization.dto';
import { NewTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.model';
import crypto from 'crypto';

@Injectable()
export class PaymentService {
  constructor(private readonly httpService: HttpService) {}

  cardTokenice(payload: CardTokenizationDto): Observable<AxiosResponse> {
    const PUBLIC_KEY = process.env.PUBLIC_KEY;
    const ENVIRONMENT_URL = process.env.ENVIRONMENT_URL;

    const headers = {
      Authorization: `Bearer ${PUBLIC_KEY}`,
      'Content-Type': 'application/json',
    };

    return this.httpService
      .post(`${ENVIRONMENT_URL}/tokens/cards`, payload, {
        headers,
      })
      .pipe(map((response) => response.data));
  }

  async generateAceptanceTokens(): Promise<{
    presigned_acceptance: string;
  }> {
    const PUBLIC_KEY = process.env.PUBLIC_KEY;
    const ENVIRONMENT_URL = process.env.ENVIRONMENT_URL;

    const merchantData = await firstValueFrom(
      this.httpService
        .get(`${ENVIRONMENT_URL}/merchants/${PUBLIC_KEY}`)
        .pipe(map((response) => response.data)),
    );

    const tokensData = {
      presigned_acceptance: merchantData.data.presigned_acceptance,
    };

    return tokensData;
  }

  async createTransaction(
    newTransactionDto: NewTransactionDto,
  ): Promise<Transaction> {
    const INTEGRITY_SECRET = process.env.INTEGRITY_SECRET;
    const PUBLIC_KEY = process.env.PUBLIC_KEY;
    const ENVIRONMENT_URL = process.env.ENVIRONMENT_URL;

    const { cardToken, total, id, customer, acceptance_token, installments } =
      newTransactionDto;

    const base = `${id}${total}COP${INTEGRITY_SECRET}`;
    const signature = crypto.createHash('sha256').update(base).digest('hex');
    const headers = {
      Authorization: `Bearer ${PUBLIC_KEY}`,
      'Content-Type': 'application/json',
    };
    const payload = {
      payment_method: {
        type: 'CARD',
        installments: installments,
        token: cardToken,
      },
      amount_in_cents: total,
      reference: id,
      currency: 'COP',
      customer_email: customer,
      acceptance_token: acceptance_token,
      signature: signature,
    };
    return await firstValueFrom(
      this.httpService
        .post(`${ENVIRONMENT_URL}/transactions`, payload, { headers })
        .pipe(map((response) => response.data)),
    );
  }
}
