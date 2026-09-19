import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import {
  ISunatProvider,
  SunatExchangeRateResponse,
} from '../../../application/ports/out/sunat.provider';

@Injectable()
export class ApiSunatProvider implements ISunatProvider {
  private readonly logger = new Logger(ApiSunatProvider.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async fetchLatestRates(): Promise<SunatExchangeRateResponse> {
    try {
      const apiUrl = this.configService.get<string>('API_SUNAT');

      if (!apiUrl) {
        throw new Error('La variable de entorno API_SUNAT no está definida');
      }

      const response = await firstValueFrom(
        this.httpService.get<SunatExchangeRateResponse>(apiUrl),
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
