import { Controller, Get, Post, Put, Param, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { SetTokenInternalDto } from "./dto/set-token.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(":username")
  findUser(@Param("username") username: string) {
    return this.authService.findUser(username);
  }

  @Get("hashpass/:username")
  getHashedPassword(@Param("username") username: string) {
    return this.authService.getHashedPassword(username);
  }

  @Post("create")
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Put("set-token")
  setToken(@Body() setTokenDto: SetTokenInternalDto) {
    return this.authService.setToken(setTokenDto);
  }
}
