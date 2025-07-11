import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthCheck,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Database health
      () => this.db.pingCheck('database'),
      
      // Memory health - 300MB heap threshold
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      
      // Memory health - 300MB RSS threshold
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
      
      // Disk health - 10% free space threshold
      () =>
        this.disk.checkStorage('storage', {
          thresholdPercent: 0.1,
          path: '/',
        }),
    ]);
  }
}
