import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SmsService } from './sms.service';
import { CreateSmDto } from './dto/create-sm.dto';
import { UpdateSmDto } from './dto/update-sm.dto';
import { SendSMSDTO } from './dto/send-sms.dto';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';

@UseGuards(JWTAuthGuard)
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @ApiBearerAuth()
  @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5 per hour — hits a paid external SMS API
  @Post('sendSmsSemaphore')
  async sendSmsSemaphore(@Body() dto: SendSMSDTO) {
    return this.smsService.sendSmsSemaphore(dto);
  }

  // @Post()
  // create(@Body() createSmDto: CreateSmDto) {
  //   return this.smsService.create(createSmDto);
  // }

  // @Get()
  // findAll() {
  //   return this.smsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.smsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSmDto: UpdateSmDto) {
  //   return this.smsService.update(+id, updateSmDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.smsService.remove(+id);
  // }
}
