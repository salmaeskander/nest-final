import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Product } from 'src/modules/products/entities/product.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  rating!: number;

  @Column()
  comment!: string;

  @Column()
  userId!: number;

  @Column()
  productId!: number;

  @ManyToOne(() => User, (user) => user.reviews, { eager: true })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Product, (product) => product.reviews, { eager: true })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @CreateDateColumn()
  createdAt!: Date;
}
