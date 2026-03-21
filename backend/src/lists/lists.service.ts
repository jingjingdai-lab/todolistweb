import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskList } from './entities/task-list.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(TaskList)
    private readonly listRepository: Repository<TaskList>,
  ) {}

  findAll() {
    return this.listRepository.find();
  }

  async create(name: string) {
    const list = this.listRepository.create({ name });
    return this.listRepository.save(list);
  }

  async remove(id: number) {
    return this.listRepository.delete(id);
  }
}
