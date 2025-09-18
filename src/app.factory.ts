import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

export async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("Davinci Hackathon API")
    .setDescription("API documentation for the Davinci Hackathon")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Entrez le token supabase dans le champ ci-dessus",
      },
      "supabase_token"
    )
    .addSecurityRequirements("supabase_token")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  return app;
}
