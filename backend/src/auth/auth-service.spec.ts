import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { AuthService } from './auth.service';
import { PrismaClient } from 'src/generated/prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { mock } from 'node:test';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: DeepMockProxy<PrismaClient>;
  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mocked_token'),
  };

  beforeEach(async () => {
    prisma = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('logIn', () => {
    const dto = {
      email: 'dimka.olekseenko@gmail.com',
      password: 'dima245618',
    };

    it('should throw UnauthorizedException if user not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(service.logIn(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return user and access token if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: 'hashed_password',
        role: 'USER',
        firstName: 'Dima',
        lastName: 'Test',
      };

      prisma.user.findFirst.mockResolvedValue(mockUser as any);
      mockJwtService.signAsync.mockResolvedValue('mocked_token');
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(service.logIn(dto)).rejects.toThrow(UnauthorizedException);
    });
    it('should return user and access token if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: 'hashed_password',
        role: 'USER',
        firstName: 'Dima',
        lastName: 'Test',
      };

      prisma.user.findFirst.mockResolvedValue(mockUser as any);
      mockJwtService.signAsync.mockResolvedValue('mock_token');
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await service.logIn(dto);

      expect(result).toHaveProperty('accessToken');
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(mockUser.email);
    });
  });

  describe('register', () => {
    const dto = {
      id: '1',
      email: 'test@test.com',
      password: '123124qa',
      role: 'USER',
      firstName: 'Dima',
      lastName: 'Test',
    };

    it('should throw if email already exists', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: '1' } as any);

      await expect(service.register(dto)).rejects.toThrow('try another email');
    });

    it('should create user and return token', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        role: 'USER',
        firstName: 'Dima',
        lastName: 'Test',
      };
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser as any);

      mockJwtService.signAsync.mockResolvedValue('mock_token');
      const result = await service.register(dto);

      expect(result.accessToken).toBe('mock_token');
      expect(prisma.user.create).toHaveBeenCalled();
      expect(result).toHaveProperty('email');
      expect(result).not.toHaveProperty('password');
    });
  });
});
