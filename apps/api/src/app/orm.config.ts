import { join } from 'path';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'ramda';

import { Company } from './companies';
import { Device } from './devices';
import { Seeds1544303473346 } from './migrations/seeds';
import { Note } from './notes';
import { Project, UserProject } from './projects';
import { User } from './users';
import { License, UserLicense } from './users-licenses';
import { UserProfile } from './users-profiles';

const type =
  (process.env.TYPEORM_CONNECTION as 'postgres' | 'mysql') || 'mysql';
console.log(join(__dirname, '../../..', '**/*.entity.{ts,js}'));

const withCache: TypeOrmModuleOptions = {
  type,
  host: '127.0.0.1',
  port: type === 'postgres' ? 5455 : 3306,
  username: type === 'mysql' ? 'admin' : 'root',
  password: type === 'mysql' ? 'admin' : 'root',
  database: 'ng_kitchen_sink',
  synchronize: false,
  logging: !isNil(process.env.TYPEORM_LOGGING)
    ? !!parseInt(process.env.TYPEORM_LOGGING, 10)
    : true,
  autoLoadEntities: true,
  entities: [
    Device,
    UserProject,
    Project,
    Company,
    Note,
    License,
    UserLicense,
    UserProfile,
    User
  ],
  migrationsTableName: 'orm_migrations',
  migrations: [Seeds1544303473346],
  connectorPackage: 'mysql2',
  migrationsRun: true
};

export = withCache;
