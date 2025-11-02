import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsISO8601 } from "class-validator";

export class SetTokenInternalDto {
  @ApiProperty() @IsString() username!: string;
  @ApiProperty() @IsString() jti!: string;
  @ApiProperty() @IsString() hashedToken!: string;
  @ApiProperty() @IsISO8601() expiresAt!: string;
}

export class RotateTokenInternalDto {
  @ApiProperty() @IsString() username!: string;
  @ApiProperty() @IsString() currentJti!: string;
  @ApiProperty() @IsString() currentHashedToken!: string; // have to be deterministic!
  @ApiProperty() @IsString() newJti!: string;
  @ApiProperty() @IsString() newHashedToken!: string;
  @ApiProperty() @IsISO8601() newExpiresAt!: string;
}
