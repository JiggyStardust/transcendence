import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import {
  CreateUserInternalDto,
  LoginUserInternalDto,
  LogoutUserInternalDto,
} from "./dto/user.dto";
import { SetTokenInternalDto, RotateTokenInternalDto } from "./dto/token.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { $Enums } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: CreateUserInternalDto) {
    const username = dto.username.trim();

    try {
      const user = await this.prisma.user.create({
        data: {
          username,
          displayName: dto.displayName ?? username,
          passwordHash: dto.passwordHash,
        },
        select: { id: true, username: true, createdAt: true },
      });

      return {
        message: "User successfully created",
        user,
      };
    } catch (e: any) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("Username already taken");
      }
      throw new InternalServerErrorException("Could not create user");
    }
  }

  async login(dto: LoginUserInternalDto) {
    const username = dto.username.trim();
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        passwordHash: true,
        isTwoFactorEnabled: true,
      },
    });
    if (user === null) throw new UnauthorizedException(`Invalid credentials`);

    const isPassValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPassValid) throw new UnauthorizedException("Invalid credentials");

    // TODO: decide how we will check online status
    this.prisma.user.update({
      where: { id: user.id },
      data: { status: $Enums.UserStatus.ONLINE },
    });

    return {
      message: "User successfully logged in",
      user: {
        id: user.id,
        username: user.username,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
      },
    };
  }

  async setToken(dto: SetTokenInternalDto) {
    const username = dto.username.trim();

    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true },
    });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    await this.prisma.refreshToken.upsert({
      where: { userId: user.id },
      update: {
        uuid: dto.jti,
        hashedToken: dto.hashedToken,
        expiresAt: new Date(dto.expiresAt),
        revoked: false,
      },
      create: {
        uuid: dto.jti,
        userId: user.id,
        hashedToken: dto.hashedToken,
        expiresAt: new Date(dto.expiresAt),
        revoked: false,
      },
    });

    return {
      message: "Token updated",
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async rotateToken(dto: RotateTokenInternalDto) {
    const username = dto.username.trim();

    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true },
    });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const record = await this.prisma.refreshToken.findUnique({
      where: { userId: user.id },
      select: { uuid: true, hashedToken: true, expiresAt: true, revoked: true },
    });

    if (!record || record.revoked || record.expiresAt <= new Date()) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const jtiMatches = record.uuid === dto.currentJti;
    const hashMatches = record.hashedToken === dto.currentHashedToken;
    if (!jtiMatches || !hashMatches) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const updated = await this.prisma.refreshToken.update({
      where: { userId: user.id },
      data: {
        uuid: dto.newJti,
        hashedToken: dto.newHashedToken,
        expiresAt: new Date(dto.newExpiresAt),
        revoked: false,
      },
      select: { uuid: true, expiresAt: true },
    });

    return {
      message: "Refresh token rotated",
      user: { id: user.id, username: user.username },
      token: { jti: updated.uuid, expiresAt: updated.expiresAt.toISOString() },
    };
  }

  async logout(dto: LogoutUserInternalDto) {
    const username = dto.username.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true },
    });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const current = await this.prisma.refreshToken.findUnique({
      where: { userId: user.id },
      select: { uuid: true, revoked: true },
    });

    if (!current || current.revoked) {
      return {
        message: "Logged out",
        user: { id: user.id, username: user.username },
      };
    }

    if (dto.jti && current.uuid !== dto.jti) {
      return {
        message: "Logged out",
        user: { id: user.id, username: user.username },
      };
    }

    this.prisma.refreshToken.delete({
      where: { userId: user.id },
    });

    // TODO: decide how we will check online status
    this.prisma.user.update({
      where: { id: user.id },
      data: { status: $Enums.UserStatus.OFFLINE },
    });

    return {
      message: "Logged out",
      user: { id: user.id, username: user.username },
    };
  }
}
