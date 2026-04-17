import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@UseGuards(JwtAuthGuard) // كل الـ endpoints محتاجة login
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // POST /wishlist/:productId
  @Post(':productId')
  add(
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.wishlistService.addToWishlist(productId, user);
  }

  // GET /wishlist/me
  @Get('me')
  getMyWishlist(@CurrentUser() user: JwtPayload) {
    return this.wishlistService.getMyWishlist(user);
  }

  // DELETE /wishlist/:productId
  @Delete(':productId')
  remove(
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.wishlistService.removeFromWishlist(productId, user);
  }
}
