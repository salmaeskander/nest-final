import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../../../common/enums/user-role.enum';
import { Order } from '../../orders/entities/order.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role!: UserRole;

  @Column({ type: 'text', nullable: true })
  hashedRefreshToken!: string | null;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @OneToMany(() => Review, (review) => review.user) reviews!: Review[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
