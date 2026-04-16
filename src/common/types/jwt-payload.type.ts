import { UserRole } from '../enums/user-role.enum';

export type JwtPayload = {
  sub: number;
  email: string;
  role: UserRole;
  tokenType: 'access' | 'refresh';
};
