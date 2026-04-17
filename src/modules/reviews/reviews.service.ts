import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(dto: CreateReviewDto, user: JwtPayload): Promise<Review> {
    const review = this.reviewRepository.create({
      rating: dto.rating,
      comment: dto.comment,
      productId: dto.productId,
      userId: user.sub,
    });
    return this.reviewRepository.save(review);
  }

  findByProduct(productId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { productId },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number, user: JwtPayload): Promise<void> {
    const review = await this.reviewRepository.findOneBy({ id });
    if (!review) throw new NotFoundException(`Review ${id} not found`);

    const isOwner = review.userId === user.sub;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You cannot delete this review');
    }

    await this.reviewRepository.remove(review);
  }
}
