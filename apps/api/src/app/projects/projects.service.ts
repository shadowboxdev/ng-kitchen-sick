import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@sdw/api/common';

import { Project } from './project.entity';

@Injectable()
export class ProjectsService extends TypeOrmCrudService<Project> {
  constructor(@InjectRepository(Project) repo) {
    super(repo);
  }
}
