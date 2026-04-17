import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { WishlistItem } from './entities/wishlist-item.entity';
import type { JwtPayload } from '../../common/types/jwt-payload.type';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private wishlistRepository: Repository<WishlistItem>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async addToWishlist(
    productId: number,
    user: JwtPayload,
  ): Promise<WishlistItem> {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    const existing = await this.wishlistRepository.findOneBy({
      userId: user.sub,
      productId,
    });
    if (existing) throw new ConflictException('Product already in wishlist');

    const item = this.wishlistRepository.create({
      userId: user.sub,
      productId,
    });
    return this.wishlistRepository.save(item);
  }

  getMyWishlist(user: JwtPayload): Promise<WishlistItem[]> {
    return this.wishlistRepository.find({
      where: { userId: user.sub },
      order: { createdAt: 'DESC' },
    });
  }

  async removeFromWishlist(productId: number, user: JwtPayload): Promise<void> {
    const item = await this.wishlistRepository.findOneBy({
      userId: user.sub,
      productId,
    });
    if (!item) throw new NotFoundException('Product not in your wishlist');
    await this.wishlistRepository.remove(item);
  }
}
