import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateUserInternalDto {
  @ApiProperty() @IsString() username: string;
  @ApiProperty({ required: false }) @IsString() displayName?: string;
  @ApiProperty() @IsString() passwordHash: string;
}

export class LoginUserInternalDto {
  @ApiProperty() @IsString() username: string;
  @ApiProperty() @IsString() password: string;
}

export class LogoutUserInternalDto {
  @ApiProperty() @IsString() username: string;
  @ApiProperty() @IsString() jti?: string;
}
