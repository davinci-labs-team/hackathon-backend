import "./otel";
import { Logger } from "@nestjs/common";
import { createApp } from "./app.factory";

async function bootstrap() {
  const app = await createApp();
  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`Swagger available at http://localhost:${port}/api`);
}
void bootstrap();
