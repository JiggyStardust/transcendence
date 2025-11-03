import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

class UserResponseEntity {
  @ApiProperty({ example: "8f3a3b9a-3b24-4c3e-bb6f-25fdbd7c0c76" })
  id: string;

  @ApiProperty({ example: "alice" })
  username: string;

  @ApiPropertyOptional({ example: "Alice Wonderland" })
  displayName?: string;

  @ApiPropertyOptional({ example: "2025-11-02T10:15:00.000Z" })
  createdAt?: Date;

  @ApiPropertyOptional({ example: false })
  isTwoFactorEnabled?: boolean;
}

class TokenResponseEntity {
  @ApiProperty({
    description: "Token unique identifier (JTI)",
    example: "4e46b6b8-4cc2-4a1d-8d64-f07b74f29e68",
  })
  jti: string;

  @ApiProperty({
    description: "Token expiration timestamp (ISO 8601)",
    example: "2025-12-01T10:15:00.000Z",
  })
  expiresAt: string;
}

export class AuthResponseEntity {
  @ApiProperty({ example: "User successfully logged in" })
  message: string;

  @ApiProperty({ type: UserResponseEntity })
  user: UserResponseEntity;

  @ApiPropertyOptional({
    type: TokenResponseEntity,
    description: "Optional access token information",
  })
  token?: TokenResponseEntity;
}
