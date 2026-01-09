import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { UserType } from './entities/user-type.entity';

@Injectable()
export class UserTypeService {
  constructor(@InjectRepository(UserType) private readonly usertypeRepository: Repository<UserType>, private dataSource: DataSource) { }
  // async createInitialUserType() {
  //   return await this.dataSource.createQueryBuilder()
  //     .insert()
  //     .into(UserType)
  //     .values([

  //       {
  //         description: "Admin"
  //       },
  //       {
  //         description: "Technician"
  //       }

  //     ])
  //     .execute()
  // }


  async create(createUserTypeDto: CreateUserTypeDto) {
    try {
      const type = this.usertypeRepository.create(createUserTypeDto);
      const saved = await this.usertypeRepository.save(type);
      if (saved) {
        return {
          msg: "Saved successful.",
          status: HttpStatus.CREATED
        }
      } else {
        return {
          msg: "Saved failed.",
          status: HttpStatus.BAD_REQUEST
        }
      }
    } catch (error) {
      return {
        msg: error,
        status: HttpStatus.BAD_REQUEST
      }
    }

  }

  getUserType(id: number) {
    return this.usertypeRepository.findOneBy({ id })
  }

  getAllUserType() {
    return this.usertypeRepository.find();
  }

  async update(id: number, updateUserTypeDto: UpdateUserTypeDto) {
    try {
      const toUpdate = await this.usertypeRepository.update(id, { description: updateUserTypeDto.description })
      if (toUpdate.affected == 1) {
        return {
          msg: "Update successful.",
          status: HttpStatus.CREATED
        }
      } else {
        return {
          msg: "Update failed.",
          status: HttpStatus.BAD_REQUEST
        }
      }
    } catch (error) {
      return {
        msg: error,
        status: HttpStatus.BAD_REQUEST
      }
    }

  }

  remove(id: number) {
    return `This action removes a #${id} userType`;
  }
}
