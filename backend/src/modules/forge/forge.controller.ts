import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ForgeService } from './forge.service';

@Controller('forge')
export class ForgeController {
  private readonly logger = new Logger(ForgeController.name);

  constructor(private readonly forgeService: ForgeService) {
    this.logger.log('🟢 ForgeController initialized successfully');
  }

  @Get('test')
  getTest() {
    this.logger.log('🟢 Test endpoint called - ForgeController is working!');
    return { message: 'ForgeController is working!', timestamp: new Date().toISOString() };
  }

  @Get('auth/token')
  async getAccessToken() {
    console.log('🔴 CRITICAL: GET /forge/auth/token endpoint called');
    this.logger.log('🔴 ENTRY POINT: GET /forge/auth/token endpoint called');
    this.logger.log('🔴 Request received, starting authentication process...');
    
    try {
      console.log('🔴 CRITICAL: About to call ForgeService.getAccessToken()...');
      this.logger.log('🔴 About to call ForgeService.getAccessToken()...');
      const token = await this.forgeService.getAccessToken();
      console.log('✅ CRITICAL: Successfully got access token from ForgeService');
      this.logger.log('✅ Successfully got access token from ForgeService');
      return {
        access_token: token,
        token_type: 'Bearer',
        expires_in: 3600,
      };
    } catch (error) {
      console.error('❌ CRITICAL: Error in getAccessToken endpoint:', error.message);
      console.error('❌ CRITICAL: Error stack:', error.stack);
      this.logger.error('❌ Error in getAccessToken endpoint:', error.message);
      this.logger.error('❌ Error stack:', error.stack);
      this.logger.error('❌ Full error object:', error);
      throw error;
    }
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

  @Get('models-test')
  async getModels() {
    this.logger.log('🔍 GET /forge/models-test endpoint called');
    console.log('🔍 GET /forge/models-test endpoint called - models route accessed');
    
    // Simple test response without calling ForgeService
    return {
      message: 'Models endpoint is working',
      timestamp: new Date().toISOString(),
      models: []
    };
    
    /* 
    try {
      const bucketKey = 'forge-viewer-models';
      const objectsList = await this.forgeService.listObjects(bucketKey);
      
      // Transform the response to include URNs and friendly names
      const models = objectsList.items?.map((item: any) => ({
        name: item.objectKey || item.key,
        urn: Buffer.from(item.objectId || item.id).toString('base64'),
        size: item.size,
        lastModified: item.lastModified,
        objectId: item.objectId || item.id
      })) || [];

      this.logger.log(`✅ Found ${models.length} models in bucket`);
      return models;
    } catch (error) {
      this.logger.error('❌ Error listing models:', error.message);
      throw error;
    }
    */
  }
}
