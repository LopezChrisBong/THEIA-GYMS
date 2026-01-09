import { AssignedModule } from 'src/assigned-modules/entities/assigned-module.entity';
import { Users } from 'src/auth/entities/auth.entity';
import { Notifications } from 'src/notifications/entities/notification.entity';
import { SysModule } from 'src/sys-modules/entities/sys-module.entity';
import { UserDetail } from 'src/user-details/entities/user-detail.entity';
import { UserRole } from 'src/user-role/entities/user-role.entity';
import { UserType } from 'src/user-type/entities/user-type.entity';


const entities = [
  Users,
  UserDetail,
  UserType,
  UserRole,
  SysModule,
  AssignedModule,
  Notifications,
];

export {
  Users,
  UserDetail,
  UserType,
  UserRole,
  SysModule,
  AssignedModule,
  Notifications,
};

export default entities;
