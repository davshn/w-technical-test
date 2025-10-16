import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { CardTokenizationDto } from './dto/card-tokenization.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly httpService: HttpService) {}

  cardTokenice(cardData: CardTokenizationDto): Observable<AxiosResponse> {
    const PUBLIC_KEY = process.env.PUBLIC_KEY;
    const UAT_SANDBOX_URL = process.env.UAT_SANDBOX_URL;

    const headers = {
      Authorization: `Bearer ${PUBLIC_KEY}`,
      'Content-Type': 'application/json',
    };

    return this.httpService
      .post(`${UAT_SANDBOX_URL}/tokens/cards`, cardData, {
        headers,
      })
      .pipe(map((response) => response.data));
  }

  async generateAceptanceTokens(): Promise<{
    presigned_acceptance: string;
    presigned_personal_data_auth: string;
  }> {
    const PUBLIC_KEY = process.env.PUBLIC_KEY;
    const UAT_SANDBOX_URL = process.env.UAT_SANDBOX_URL;

    const merchantData = await firstValueFrom(
      this.httpService
        .get(`${UAT_SANDBOX_URL}/merchants/${PUBLIC_KEY}`)
        .pipe(map((response) => response.data)),
    );

    const tokensData = {
      presigned_acceptance: merchantData.data.presigned_acceptance,
      presigned_personal_data_auth: merchantData.data.presigned_acceptance,
    };

    return tokensData;
  }
}
