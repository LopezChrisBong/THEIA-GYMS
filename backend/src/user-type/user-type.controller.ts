import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserTypeService } from './user-type.service';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';

@ApiTags("User Type")
@Controller('user-type')
@UseGuards(JWTAuthGuard)
@ApiBearerAuth()
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) { }

  @Post()
  create(@Body() createUserTypeDto: CreateUserTypeDto) {
    return this.userTypeService.create(createUserTypeDto);
  }

  // @Post('createInitialUserType')
  // createInitialUserType() {
  //   return this.userTypeService.createInitialUserType();
  // }

  @Get('getAllUsertype')
  getAllUserType() {
    return this.userTypeService.getAllUserType();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserTypeDto: UpdateUserTypeDto) {
    return this.userTypeService.update(+id, updateUserTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userTypeService.remove(+id);
  }
}
