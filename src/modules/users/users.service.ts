import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(
    email: string,
    passwordHash: string,
    role: UserRole = UserRole.CUSTOMER,
  ): Promise<User> {
    const user = this.usersRepository.create({
      email,
      passwordHash,
      role,
      hashedRefreshToken: null,
    });
    return this.usersRepository.save(user);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  updateHashedRefreshToken(
    userId: number,
    hashedRefreshToken: string | null,
  ): Promise<void> {
    return this.usersRepository
      .update(userId, { hashedRefreshToken })
      .then(() => undefined);
  }
}
