import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import * as crypto from 'crypto';

@Injectable()
export class SettingsService {
  private readonly encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';

  constructor(
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>,
  ) {}

  async create(createSettingDto: CreateSettingDto): Promise<Setting> {
    const setting = this.settingsRepository.create({
      ...createSettingDto,
      value: createSettingDto.isEncrypted 
        ? this.encrypt(createSettingDto.value)
        : createSettingDto.value,
    });

    return this.settingsRepository.save(setting);
  }

  async findAll(): Promise<Setting[]> {
    const settings = await this.settingsRepository.find();
    return settings.map(setting => ({
      ...setting,
      value: setting.isEncrypted ? this.decrypt(setting.value) : setting.value,
    }));
  }

  async findByKey(key: string): Promise<Setting | null> {
    const setting = await this.settingsRepository.findOne({ where: { key } });
    if (!setting) {
      return null;
    }

    return {
      ...setting,
      value: setting.isEncrypted ? this.decrypt(setting.value) : setting.value,
    };
  }

  async update(key: string, updateSettingDto: UpdateSettingDto): Promise<Setting> {
    const setting = await this.settingsRepository.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }

    const updatedValue = updateSettingDto.value && updateSettingDto.isEncrypted
      ? this.encrypt(updateSettingDto.value)
      : updateSettingDto.value;

    await this.settingsRepository.update(setting.id, {
      ...updateSettingDto,
      value: updatedValue || setting.value,
    });

    return this.findByKey(key);
  }

  async upsert(key: string, value: string, description?: string, isEncrypted = false): Promise<Setting> {
    const existingSetting = await this.settingsRepository.findOne({ where: { key } });
    
    if (existingSetting) {
      return this.update(key, { value, description, isEncrypted });
    } else {
      return this.create({ key, value, description, isEncrypted });
    }
  }

  async remove(key: string): Promise<void> {
    const setting = await this.settingsRepository.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }

    await this.settingsRepository.remove(setting);
  }

  // Forge-specific methods
  async getForgeClientId(): Promise<string | null> {
    const setting = await this.findByKey('FORGE_CLIENT_ID');
    return setting?.value || null;
  }

  async getForgeClientSecret(): Promise<string | null> {
    const setting = await this.findByKey('FORGE_CLIENT_SECRET');
    return setting?.value || null;
  }

  async setForgeCredentials(clientId: string, clientSecret: string): Promise<void> {
    console.log('SettingsService.setForgeCredentials called with:', {
      clientId: clientId ? `${clientId.substring(0, 8)}...` : 'null',
      clientSecret: clientSecret ? '[PROVIDED]' : 'null'
    });

    try {
      // Client ID should not be encrypted, Client Secret should be encrypted
      console.log('Saving FORGE_CLIENT_ID...');
      await this.upsert('FORGE_CLIENT_ID', clientId, 'Autodesk Forge Client ID', false);
      console.log('FORGE_CLIENT_ID saved successfully');

      console.log('Saving FORGE_CLIENT_SECRET...');
      await this.upsert('FORGE_CLIENT_SECRET', clientSecret, 'Autodesk Forge Client Secret', true);
      console.log('FORGE_CLIENT_SECRET saved successfully');
    } catch (error) {
      console.error('Error in setForgeCredentials:', error);
      throw error;
    }
  }

  private encrypt(text: string): string {
    try {
      const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(text, 'utf-8', 'hex');
      encrypted += cipher.final('hex');
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      return text; // Return original text if encryption fails
    }
  }

  private decrypt(encryptedText: string): string {
    try {
      if (!encryptedText.includes(':')) {
        // If no separator, assume it's not encrypted
        return encryptedText;
      }
      
      const [ivHex, encrypted] = encryptedText.split(':');
      const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
      decrypted += decipher.final('utf-8');
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedText; // Return original text if decryption fails
    }
  }
}
