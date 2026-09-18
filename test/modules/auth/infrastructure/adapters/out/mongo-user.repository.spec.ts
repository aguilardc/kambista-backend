import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MongoUserRepository } from '@src/modules/auth/infrastructure/adapters/out/mongo-user.repository.service';
import { User as DomainUser } from '@src/modules/auth/domain/entities/user.entity';
import { Email } from '@src/modules/auth/domain/value-objects/email.vo';
import { Password } from '@src/modules/auth/domain/value-objects/password.vo';
import { Role } from '@src/modules/auth/domain/value-objects/role.vo';

describe('MongoUserRepository', () => {
  let repository: MongoUserRepository;
  let mockUserModel: any;

  beforeEach(() => {
    // Simulamos la clase constructora del Modelo de Mongoose
    mockUserModel = function (this: any, data: any) {
      Object.assign(this, data);
      this.save = vi.fn().mockResolvedValue(this);
    };

    mockUserModel.findOne = vi.fn();
    mockUserModel.findById = vi.fn();

    repository = new MongoUserRepository(mockUserModel);
  });

  it('debe guardar un usuario extrayendo los valores del dominio', async () => {
    const domainUser = new DomainUser(
      '1',
      new Email('test@kambista.com'),
      new Password('hashed', true),
      new Role('user'),
    );

    // Si no lanza excepción, el mapeo inverso (Dominio a Mongoose) funcionó
    await expect(repository.save(domainUser)).resolves.not.toThrow();
  });

  it('debe buscar por email, mapear el documento a Dominio y retornarlo', async () => {
    const mockDoc = {
      _id: '1',
      email: 'test@kambista.com',
      password: 'hashed',
      role: 'user',
      createdAt: new Date(),
    };

    // Mongoose encadena métodos: findOne().exec()
    mockUserModel.findOne.mockReturnValue({
      exec: vi.fn().mockResolvedValue(mockDoc),
    });

    const result = await repository.findByEmail('test@kambista.com');

    expect(result).toBeInstanceOf(DomainUser);
    expect(result?.getEmail).toBe('test@kambista.com');
    expect(result?.getRole).toBe('user');
  });

  it('debe retornar null si findByEmail no encuentra ningún documento', async () => {
    mockUserModel.findOne.mockReturnValue({
      exec: vi.fn().mockResolvedValue(null),
    });

    const result = await repository.findByEmail('no-existe@kambista.com');
    expect(result).toBeNull();
  });
});
