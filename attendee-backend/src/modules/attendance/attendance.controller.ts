import {
  Controller,
  Post,
  Param,
  Req,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttendanceService } from './attendance.service';
import { multerConfig } from './multer.config';
import { AttendanceQueryDto } from './dto/attendance-query.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Phase 1
  @Post('clock-in')
  clockIn(@Req() req) {
    return this.attendanceService.clockIn(req.user);
  }

  // Phase 2
  @Post(':id/upload-proof')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadProof(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.attendanceService.attachProof(id, file.path);
  }

  // Phase 3
  @Post('clock-out')
  clockOut(@Req() req) {
    return this.attendanceService.clockOut(req.user);
  }

  @Get()
  @Roles('HR')
  findAllToday(@Query() query: AttendanceQueryDto) {
    return this.attendanceService.findAllTodayPaginated(query);
  }
}
