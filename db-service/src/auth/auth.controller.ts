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
import { ApiTags } from "@nestjs/swagger";
// TODO: import { InternalGuard } from "../common/guards/internal.guard";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(201)
  register(@Body() dto: CreateUserInternalDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  @HttpCode(200)
  login(@Body() dto: LoginUserInternalDto) {
    return this.authService.login(dto);
  }

  @Post("logout")
  @HttpCode(200)
  logout(@Body() dto: LogoutUserInternalDto) {
    return this.authService.logout(dto);
  }

  @Put("users/:username/set-token")
  // TODO: add @UseGuards
  setToken(
    @Param("username") username: string,
    @Body() dto: SetTokenInternalDto,
  ) {
    return this.authService.setToken({ ...dto, username });
  }

  @Put("users/:username/rotate-token")
  // TODO: add @UseGuards
  rotateToken(
    @Param("username") username: string,
    @Body() dto: RotateTokenInternalDto,
  ) {
    return this.authService.rotateToken({ ...dto, username });
  }
}
