import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // POST /reviews — customer only
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  create(@Body() dto: CreateReviewDto, @CurrentUser() user: JwtPayload) {
    return this.reviewsService.create(dto, user);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewsService.findByProduct(productId);
  }

  // DELETE /reviews/:id — owner or admin
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reviewsService.remove(id, user);
  }
}
