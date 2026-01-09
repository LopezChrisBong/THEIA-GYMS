import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';
import { currentUser } from 'src/shared/jwtDecode';

@Controller('notifications')
@ApiTags('NOtifications')
@UseGuards(JWTAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('getMyNotifs')
  getMyNotifs(@Headers() headers) {
    var head_str = headers.authorization;

    const curr_user = currentUser(head_str);
    return this.notificationsService.getMyNotifs(curr_user);
  }

  @Get('getMyNewNotifsCount')
  getMyNewNotifsCount(@Headers() headers) {
    var head_str = headers.authorization;

    const curr_user = currentUser(head_str);
    return this.notificationsService.getMyNewNotifsCount(curr_user);
  }

  @Post('markAllAsRead')
  markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsReadFunc(req.body);
  }

  @Post('markOneAsRead')
  markOneAsRead(@Request() req) {
    return this.notificationsService.markOneAsRead(req.body);
  }
}
