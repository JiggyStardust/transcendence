import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
// TODO: import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: { level: "error" } }),
  );

  // TODO app.useGlobalPipes();

  const config = new DocumentBuilder()
    .setTitle("Pong DB")
    .setDescription("REST API documentation for Pong database.")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("db-api", app, document);

  await app.listen(process.env.PORT ?? 3000, process.env.HOST ?? "localhost");
  console.log(
    "Pong DB listen on",
    `${process.env.HOST ?? "localhost"}:${process.env.PORT ?? "3000"}`,
  );
}
bootstrap();
