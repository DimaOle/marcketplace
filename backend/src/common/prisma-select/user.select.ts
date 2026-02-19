import { User } from 'src/generated/prisma/client';

export const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

export const userAuthSelect = {
  ...userSelect,
  password: true,
} as const;

export type UserResponse = Pick<User, keyof typeof userSelect>;

export type UserWithPassword = Pick<User, keyof typeof userAuthSelect>;

export type UserResponseWithAccesToken = UserResponse & { accessToken: string };
