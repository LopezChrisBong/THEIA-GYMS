import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { DataSource, Repository } from 'typeorm';
import { Notifications } from './entities/notification.entity';
import { UserDetail } from 'src/entities';

@Injectable()
export class NotificationsService {
  constructor(private dataSource: DataSource, @InjectRepository(Notifications)
  private readonly Notifications: Repository<Notifications>,) { }
  getMyNotifs(user: any) {
    return this.dataSource.manager
      .createQueryBuilder(Notifications, 'notif')
      .select([
        'notif.*',
        "IF (!ISNULL(us.mname), concat(us.fname, ' ',SUBSTRING(us.mname, 1, 1) ,'. ',us.lname) ,concat(us.fname, ' ', us.lname)) as notif_from_name",
      ])
      .leftJoin(UserDetail, 'us', 'notif.user_detailID_from = us.id')
      .where('notif.user_detailID_to = :id', { id: user.userdetail.id })
      .orderBy('notif.created_at', 'DESC')
      // .addOrderBy('notif.isOpenned', 'ASC')
      .getRawMany();
  }

  getMyNewNotifsCount(user: any) {
    return this.dataSource.manager
      .createQueryBuilder(Notifications, 'notif')
      .where('notif.user_detailID_to = :id', { id: user.userdetail.id })
      .andWhere('notif.isOpenned = 0')
      .getCount();
  }

  markAllAsReadFunc(data: any) {
    try {
      for (var i = 0; i < data.length; i++) {
        this.Notifications.update(data[i].id, {
          isOpenned: true,
        });
      }

      return {
        msg: 'Saved successfully.',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        msg: 'Something went wrong.',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  markOneAsRead(data: any) {
    try {
      this.Notifications.update(data.id, {
        isOpenned: true,
      });

      return {
        msg: 'Saved successfully.',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        msg: 'Something went wrong.',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
