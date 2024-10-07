import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('서버 상태')
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: MongooseHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    @ApiOperation({ summary: '데이터베이스 상태 반환' })
    @ApiResponse({ status: 200, description: '데이터베이스 연결 성공', type: Object })
    @ApiResponse({ status: 503, description: '데이터베이스 연결 실패' })
    check() {
        return this.health.check([
            () => this.db.pingCheck('mongodb')
        ]);
    }
}
