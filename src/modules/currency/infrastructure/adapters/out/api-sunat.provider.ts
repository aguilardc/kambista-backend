import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  ISunatProvider,
  SunatExchangeRateResponse,
} from '../../../application/ports/out/sunat.provider';

@Injectable()
export class ApiSunatProvider implements ISunatProvider {
  private readonly logger = new Logger(ApiSunatProvider.name);

  constructor(private readonly httpService: HttpService) {}

  async fetchLatestRates(): Promise<SunatExchangeRateResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<SunatExchangeRateResponse>('API_SUNAT'),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error de red al consultar el API de SUNAT', error);
      throw new InternalServerErrorException(
        'No se pudo conectar con el proveedor de tipo de cambio',
      );
    }
  }
}
