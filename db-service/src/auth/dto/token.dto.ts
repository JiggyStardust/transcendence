import { ApiHideProperty } from "@nestjs/swagger";
import { IsString, IsISO8601 } from "class-validator";

export class SetTokenInternalDto {
  @ApiHideProperty() @IsString() username!: string;
  @ApiHideProperty() @IsString() jti!: string;
  @ApiHideProperty() @IsString() hashedToken!: string;
  @ApiHideProperty() @IsISO8601() expiresAt!: string;
}

export class RotateTokenInternalDto {
  @ApiHideProperty() @IsString() username!: string;
  @ApiHideProperty() @IsString() currentJti!: string;
  @ApiHideProperty() @IsString() currentHashedToken!: string; // have to be deterministic!
  @ApiHideProperty() @IsString() newJti!: string;
  @ApiHideProperty() @IsString() newHashedToken!: string;
  @ApiHideProperty() @IsISO8601() newExpiresAt!: string;
}
