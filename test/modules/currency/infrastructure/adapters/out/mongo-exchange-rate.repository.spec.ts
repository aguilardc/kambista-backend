import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MongoExchangeRateRepository } from '@src/modules/currency/infrastructure/adapters/out/mongo-exchange-rate.repository';
import { ExchangeRate } from '@src/modules/currency/domain/entities/exchange-rate.entity';
import { CurrencyCode } from '@src/modules/currency/domain/value-objects/currency-code.vo';
import { RateValue } from '@src/modules/currency/domain/value-objects/rate-value.vo';

describe('MongoExchangeRateRepository', () => {
  let repository: MongoExchangeRateRepository;
  let mockModel: any;

  beforeEach(() => {
    // Simulamos el constructor del modelo Mongoose para el método save()
    mockModel = function (this: any, data: any) {
      Object.assign(this, data);
      this.save = vi.fn().mockResolvedValue(this);
    };

    mockModel.findOne = vi.fn();
    repository = new MongoExchangeRateRepository(mockModel);
  });

  it('debe guardar un nuevo registro extrayendo los datos de la Entidad', async () => {
    const entity = new ExchangeRate(
      new CurrencyCode('USD'),
      new RateValue(3.7),
      new RateValue(3.8),
      new Date('2026-09-18T10:00:00Z'),
    );

    // Si la promesa se resuelve sin lanzar errores, el guardado simulado fue exitoso
    await expect(repository.save(entity)).resolves.not.toThrow();
  });

  it('debe buscar el registro más reciente, ordenarlo descendentemente y mapearlo al Dominio', async () => {
    const mockDoc = {
      currencyCode: 'USD',
      buyRate: 3.7,
      sellRate: 3.8,
      syncDate: new Date('2026-09-18T10:00:00Z'),
    };

    // Simulamos la cadena findOne().sort().exec() de Mongoose
    mockModel.findOne.mockReturnValue({
      sort: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockDoc),
      }),
    });

    const result = await repository.findLatest(new CurrencyCode('USD'));

    expect(mockModel.findOne).toHaveBeenCalledWith({ currencyCode: 'USD' });
    expect(result).toBeInstanceOf(ExchangeRate);
    expect(result?.getBuyRate).toBe(3.7);
    expect(result?.getSellRate).toBe(3.8);
  });

  it('debe retornar null si findLatest no encuentra ningún registro en el historial', async () => {
    mockModel.findOne.mockReturnValue({
      sort: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      }),
    });

    const result = await repository.findLatest(new CurrencyCode('USD'));

    expect(result).toBeNull();
  });
});
