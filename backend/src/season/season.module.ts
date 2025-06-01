import { Module } from '@nestjs/common';
import { SeasonService } from './season.service';
import { SeasonController } from './season.controller';

@Module({
  providers: [SeasonService],
  controllers: [SeasonController]
})
export class SeasonModule {}
