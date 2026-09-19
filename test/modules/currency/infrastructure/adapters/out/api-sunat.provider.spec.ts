import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';
import { InternalServerErrorException } from '@nestjs/common';
import { ApiSunatProvider } from '@src/modules/currency/infrastructure/adapters/out/api-sunat.provider';

describe('ApiSunatProvider', () => {
  let provider: ApiSunatProvider;
  let mockHttpService: any;

  beforeEach(() => {
    mockHttpService = {
      get: vi.fn(),
    };
    provider = new ApiSunatProvider(mockHttpService);
  });

  it('debe retornar la data mapeada exactamente a la interfaz cuando la API responde correctamente', async () => {
    const mockResponse = {
      data: {
        origen: 'SUNAT',
        compra: 3.7,
        venta: 3.8,
        moneda: 'USD',
        fecha: '2026-09-18',
      },
    };

    // Simulamos un Observable exitoso que es lo que Axios/HttpService devuelve
    mockHttpService.get.mockReturnValue(of(mockResponse));

    const result = await provider.fetchLatestRates();

    expect(mockHttpService.get).toHaveBeenCalledWith('API_SUNAT');
    expect(result).toEqual(mockResponse.data);
  });

  it('debe lanzar InternalServerErrorException si la API de SUNAT falla o da timeout', async () => {
    // Simulamos un error de red o caída del servicio
    mockHttpService.get.mockReturnValue(
      throwError(() => new Error('Network Error')),
    );

    await expect(provider.fetchLatestRates()).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
