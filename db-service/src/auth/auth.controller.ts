// [INFO]:
// Controllers are responsible for handling incoming requests and sending responses back to the client.
// https://docs.nestjs.com/controllers

import { Controller, Post, Put, Body, Param, HttpCode } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  CreateUserInternalDto,
  LoginUserInternalDto,
  LogoutUserInternalDto,
} from "./dto/user.dto";
import { SetTokenInternalDto, RotateTokenInternalDto } from "./dto/token.dto";
import { AuthResponseEntity } from "./entities/auth-response.entity";
import { ApiTags, ApiCreatedResponse } from "@nestjs/swagger";
// TODO: import { InternalGuard } from "../common/guards/internal.guard";

@Controller("auth")
@ApiTags("Auth API")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(201)
  @ApiCreatedResponse({ type: AuthResponseEntity })
  register(@Body() dto: CreateUserInternalDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  @HttpCode(200)
  @ApiCreatedResponse({ type: AuthResponseEntity })
  login(@Body() dto: LoginUserInternalDto) {
    return this.authService.login(dto);
  }

  @Post("logout")
  @HttpCode(200)
  @ApiCreatedResponse({ type: AuthResponseEntity })
  logout(@Body() dto: LogoutUserInternalDto) {
    return this.authService.logout(dto);
  }

  @Put("users/:username/set-token")
  @HttpCode(201)
  // TODO: add @UseGuards
  @ApiCreatedResponse({ type: AuthResponseEntity })
  setToken(
    @Param("username") username: string,
    @Body() dto: SetTokenInternalDto,
  ) {
    return this.authService.setToken({ ...dto, username });
  }

  @Put("users/:username/rotate-token")
  @HttpCode(201)
  // TODO: add @UseGuards
  @ApiCreatedResponse({ type: AuthResponseEntity })
  rotateToken(
    @Param("username") username: string,
    @Body() dto: RotateTokenInternalDto,
  ) {
    return this.authService.rotateToken({ ...dto, username });
  }
}
