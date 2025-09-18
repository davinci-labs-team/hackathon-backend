import { Controller, Get } from "@nestjs/common";
import { Public } from "src/common/decorators/public.decorator";
import axios, { AxiosResponse } from "axios";
import { FastAPIResponseDto } from "./dto/fastAPI-response.dto";

@Controller("external-module")
export class ExternalModuleController {
  @Public()
  @Get("test")
  async getFileUrl(): Promise<string> {
    try {
      // Typage explicite de la réponse Axios
      const response: AxiosResponse<FastAPIResponseDto> = await axios.get(
        "http://127.0.0.1:8000/example"
      );

      // ✅ Maintenant TypeScript sait que device_specs est une string
      return response.data.device_specs;
    } catch (error: any) {
      console.error("Erreur lors de l’appel du service Python:", error);
      throw new Error("Impossible de contacter le service Python");
    }
  }
}
