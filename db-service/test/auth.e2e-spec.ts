import { Test } from "@nestjs/testing";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

// Import your real modules
import { AuthController } from "../src/auth/auth.controller";
import { AuthService } from "../src/auth/auth.service";
import { PrismaService } from "../src/prisma/prisma.service";

describe("Auth e2e (Fastify + Prisma in-memory)", () => {
  let app: NestFastifyApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.refreshToken.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it("POST /auth/register -> 201", async () => {
    const payload = {
      username: "alice",
      displayName: "Alice",
      passwordHash: await bcrypt.hash("secret", 10),
    };

    const res = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload,
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.user.username).toBe("alice");
  });

  it("POST /auth/login -> 200", async () => {
    await prisma.user.create({
      data: {
        username: "alice",
        displayName: "Alice",
        passwordHash: await bcrypt.hash("secret", 10),
      },
    });

    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { username: "alice", password: "secret" },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().user.username).toBe("alice");
  });

  it("POST /auth/logout -> 200", async () => {
    await prisma.user.create({
      data: {
        username: "alice",
        displayName: "Alice",
        passwordHash: await bcrypt.hash("secret", 10),
      },
    });

    const res = await app.inject({
      method: "POST",
      url: "/auth/logout",
      payload: { username: "alice" },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().user.username).toBe("alice");
  });

  it("PUT /auth/users/:username/set-token -> 201", async () => {
    const user = await prisma.user.create({
      data: { username: "alice", displayName: "Alice", passwordHash: "h" },
    });

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const res = await app.inject({
      method: "PUT",
      url: `/auth/users/${user.username}/set-token`,
      payload: { jti: "j1", hashedToken: "h1", expiresAt },
    });

    expect(res.statusCode).toBe(201);
    const row = await prisma.refreshToken.findUnique({
      where: { userId: user.id },
    });
    expect(row?.uuid).toBe("j1");
  });

  it("PUT /auth/users/:username/rotate-token -> 201", async () => {
    const user = await prisma.user.create({
      data: { username: "alice", displayName: "Alice", passwordHash: "h" },
    });

    await prisma.refreshToken.upsert({
      where: { userId: user.id },
      update: {
        uuid: "old",
        hashedToken: "hashOld",
        expiresAt: new Date(Date.now() + 60_000),
        revoked: false,
      },
      create: {
        userId: user.id,
        uuid: "old",
        hashedToken: "hashOld",
        expiresAt: new Date(Date.now() + 60_000),
        revoked: false,
      },
    });

    const newExpiresAt = new Date(Date.now() + 120_000).toISOString();

    const res = await app.inject({
      method: "PUT",
      url: `/auth/users/${user.username}/rotate-token`,
      payload: {
        currentJti: "old",
        currentHashedToken: "hashOld",
        newJti: "new",
        newHashedToken: "hashNew",
        newExpiresAt,
      },
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.token.jti).toBe("new");

    const row = await prisma.refreshToken.findUnique({
      where: { userId: user.id },
    });
    expect(row?.uuid).toBe("new");
    expect(row?.hashedToken).toBe("hashNew");
  });
});
