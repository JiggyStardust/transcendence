import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class SetTokenInternalDto {
  @ApiProperty() jti!: string;
  @ApiProperty() username!: string;
  @ApiProperty() hashedToken!: string;

  @Type(() => Date)
  @ApiProperty()
  expiresAt!: Date;
}
