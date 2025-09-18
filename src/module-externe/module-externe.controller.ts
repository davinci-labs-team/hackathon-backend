import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import axios from 'axios';

@Controller('module-externe')
export class ModuleExterneController {
  @Public()
  @Get('test')
  async getFileUrl(): Promise<string> {
    try {
      // Appel du service Python FastAPI
      const response = await axios.get('http://127.0.0.1:8000/example');
      
      // Récupère le champ "device_specs" renvoyé par FastAPI
      return response.data.device_specs;
    } catch (error) {
      console.error('Erreur lors de l’appel du service Python:', error.message);
      throw new Error('Impossible de contacter le service Python');
    }
  }
}
