import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '../../common/enums/order-status.enum';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly productsService: ProductsService,
  ) {}

  async createForUser(dto: CreateOrderDto, user: JwtPayload): Promise<Order> {
    const items: OrderItem[] = [];
    let total = 0;

    for (const itemDto of dto.items) {
      const product = await this.productsService.findOne(itemDto.productId);
      const unitPrice = Number(product.price);
      total += unitPrice * itemDto.quantity;

      items.push({
        product,
        productId: product.id,
        quantity: itemDto.quantity,
        priceAtPurchase: unitPrice.toFixed(2),
      } as OrderItem);
    }

    const order = this.ordersRepository.create({
      userId: user.sub,
      status: OrderStatus.PENDING,
      totalPrice: total.toFixed(2),
      items,
    });
    return this.ordersRepository.save(order);
  }

  findMyOrders(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      order: { id: 'DESC' },
    });
  }

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ order: { id: 'DESC' } });
  }
}
