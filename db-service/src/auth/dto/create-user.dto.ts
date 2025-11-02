import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty() username: string;
  @ApiProperty({ required: false }) displayName?: string;
  @ApiProperty() passwordHash: string;
}
