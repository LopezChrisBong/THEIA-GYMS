import { Module } from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { UserDetailsController } from './user-details.controller';
import { AuthService } from 'src/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDetail } from './entities/user-detail.entity';
import {  Users, UserType } from 'src/entities';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserTypeService } from 'src/user-type/user-type.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [ConfigModule.forRoot(), JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: Number(process.env.JWT_TOKEN_EXPIRATION || 86400),}
  }), TypeOrmModule.forFeature([UserDetail, Users, UserType])],
  controllers: [UserDetailsController],
  providers: [UserDetailsService, AuthService, UserTypeService, MailService]
})
export class UserDetailsModule { }
