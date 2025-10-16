import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CardTokenizationDto } from './dto/card-tokenization.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly httpService: HttpService) {}

  cardTokenization(cardData: CardTokenizationDto): Observable<AxiosResponse> {
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
}
