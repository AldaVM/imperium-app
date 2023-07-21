import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto, AuthRegisterDto } from './dto';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signToken(
    userId: number,
    email: string,
    active: boolean,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email: email,
      active: active,
    };

    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }

  async signup(dto: AuthRegisterDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
          rolId: dto.rol,
        },
      });

      return this.signToken(user.id, user.email, true);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // if user non active throw exception
    if (!user.active) throw new ForbiddenException('Non-active user');

    // compare password
    const isMatch = await argon.verify(user.hash, dto.password);

    // if password incorrect throw exception
    if (!isMatch) throw new ForbiddenException('Credentials taken');

    // send token
    return this.signToken(user.id, user.email, user.active);
  }
}
