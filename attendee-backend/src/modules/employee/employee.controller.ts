import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { EmployeeQueryDto } from './dto/employee-query.dto';

@Controller('employees')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // HR only
  @Post()
  @Roles('HR')
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }

  @Get()
  @Roles('HR')
  findAll(@Query() query: EmployeeQueryDto) {
    return this.employeeService.findAllPaginated(query);
  }

  @Patch(':id')
  @Roles('HR')
  update(@Param('id') id: number, @Body() dto: UpdateEmployeeDto) {
    return this.employeeService.update(id, dto);
  }

  @Delete(':id')
  @Roles('HR')
  remove(@Param('id') id: number) {
    return this.employeeService.remove(id);
  }

  //   any user
  @Get('me')
  getMe(@Req() req) {
    return this.employeeService.findOne(req.user.userId);
  }
}
