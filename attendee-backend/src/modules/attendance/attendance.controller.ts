import {
  Controller,
  Post,
  Param,
  Req,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttendanceService } from './attendance.service';
import { multerConfig } from './multer.config';
import { AttendanceQueryDto } from './dto/attendance-query.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('attendance')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // clock in
  @Post('clock-in')
  clockIn(@Req() req) {
    return this.attendanceService.clockIn(req.user);
  }

  // is clocked in
  @Get('is-clocked-in')
  isClockedIn(@Req() req) {
    return this.attendanceService.isClockedIn(req.user);
  }

  @Get('insights')
  getInsights(@Req() req, @Query('month') month?: string) {
    return this.attendanceService.getMonthlyInsights(req.user, month);
  }

  // upload pic
  @Post(':id/upload-proof')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadProof(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.attendanceService.attachProof(id, file.path);
  }

  // clock out
  @Post('clock-out')
  clockOut(@Req() req) {
    return this.attendanceService.clockOut(req.user);
  }

  @Get()
  @Roles('HR')
  findAll(@Query() query: AttendanceQueryDto) {
    return this.attendanceService.findAllAttendances(query);
  }
}
