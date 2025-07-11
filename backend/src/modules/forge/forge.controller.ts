import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ForgeService } from './forge.service';

@Controller('forge')
export class ForgeController {
  constructor(private readonly forgeService: ForgeService) {}

  @Get('auth/token')
  async getAccessToken() {
    const token = await this.forgeService.getAccessToken();
    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 3600,
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Create bucket if it doesn't exist
    const bucketKey = 'forge-viewer-models';
    await this.forgeService.createBucket(bucketKey);

    // Upload file to Forge
    const objectName = `${Date.now()}-${file.originalname}`;
    const uploadResult = await this.forgeService.uploadFile(
      bucketKey,
      objectName,
      file.buffer,
    );

    // Start translation
    const urn = Buffer.from(uploadResult.objectId).toString('base64');
    const translationResult = await this.forgeService.translateModel(urn);

    return {
      urn,
      objectId: uploadResult.objectId,
      size: uploadResult.size,
      translation: translationResult,
    };
  }

  @Post('translate')
  async translateModel(@Body('urn') urn: string) {
    return this.forgeService.translateModel(urn);
  }

  @Get('translate/:urn/status')
  async getTranslationStatus(@Param('urn') urn: string) {
    return this.forgeService.getTranslationStatus(urn);
  }
}
