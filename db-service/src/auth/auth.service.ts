import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { SetTokenInternalDto } from "./dto/set-token.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { $Enums } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async findUser(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      omit: { passwordHash: true },
    });
    if (user === null) {
      throw new NotFoundException(`User ${username} not found`);
    }
    return user;
  }

  async getHashedPassword(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, passwordHash: true },
    });
    if (user === null) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return user;
  }

  async createUser(dto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: {
          username: dto.username,
          displayName: dto.displayName ?? dto.username,
          passwordHash: dto.passwordHash,
        },
        omit: { passwordHash: true },
      });
    } catch (e: any) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("Username already taken");
      }
      throw e;
    }
  }

  async setToken(dto: SetTokenInternalDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
      select: { id: true },
    });
    if (user === null) {
      throw new NotFoundException(`User ${dto.username} not found`);
    }

    const userId = user.id;
    return await this.prisma.refreshToken.upsert({
      where: { userId },
      update: {
        uuid: dto.jti,
        hashedToken: dto.hashedToken,
        expiresAt: dto.expiresAt,
        revoked: false,
      },
      create: {
        uuid: dto.jti,
        userId,
        hashedToken: dto.hashedToken,
        expiresAt: dto.expiresAt,
      },
    });
  }
}
