import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '../../../application/ports/out/user.repository.interface';
import { User as DomainUser } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { Password } from '../../../domain/value-objects/password.vo';
import { Role } from '../../../domain/value-objects/role.vo';
import { User as SchemaUser, UserDocument } from './schemas/user.schema';

@Injectable()
export class MongoUserRepository implements IUserRepository {
  constructor(
    @InjectModel(SchemaUser.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async save(user: DomainUser): Promise<void> {
    const newUser = new this.userModel({
      _id: user.getId,
      email: user.getEmail,
      password: user.getPassword,
      role: user.getRole,
      createdAt: user.getCreatedAt,
    });
    await newUser.save();
  }

  async findByEmail(email: string): Promise<DomainUser | null> {
    const doc = await this.userModel.findOne({ email }).exec();
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async findById(id: string): Promise<DomainUser | null> {
    const doc = await this.userModel.findById(id).exec();
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  private mapToDomain(doc: UserDocument): DomainUser {
    return new DomainUser(
      doc._id as string,
      new Email(doc.email),
      new Password(doc.password, true),
      new Role(doc.role),
      doc.createdAt,
    );
  }
}
