import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Patch(':key')
  update(@Param('key') key: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(key, updateSettingDto);
  }

  @Delete(':key')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('key') key: string) {
    return this.settingsService.remove(key);
  }

  @Post('forge-credentials')
  @HttpCode(HttpStatus.OK)
  async setForgeCredentials(@Body() body: { clientId: string; clientSecret: string }) {
    console.log('SettingsController.setForgeCredentials called with:', {
      clientId: body.clientId ? `${body.clientId.substring(0, 8)}...` : 'null',
      clientSecret: body.clientSecret ? '[PROVIDED]' : 'null'
    });

    try {
      await this.settingsService.setForgeCredentials(body.clientId, body.clientSecret);
      console.log('Forge credentials saved successfully');
      return { message: 'Forge credentials saved successfully' };
    } catch (error) {
      console.error('Error saving forge credentials:', error);
      throw error;
    }
  }

  @Get('forge-credentials/status')
  async getForgeCredentialsStatus() {
    const clientId = await this.settingsService.getForgeClientId();
    const clientSecret = await this.settingsService.getForgeClientSecret();
    
    return {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      clientId: clientId ? clientId.substring(0, 8) + '...' : null, // Show only first 8 chars for security
    };
  }

  @Delete('forge-credentials')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteForgeCredentials() {
    await this.settingsService.remove('FORGE_CLIENT_ID').catch(() => {});
    await this.settingsService.remove('FORGE_CLIENT_SECRET').catch(() => {});
    return { message: 'Forge credentials deleted successfully' };
  }
}
