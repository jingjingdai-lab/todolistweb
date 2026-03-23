import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskList } from './entities/task-list.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(TaskList)
    private readonly listRepository: Repository<TaskList>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  // Get all lists that belong to a specific user
  findAllByUser(userId: number) {
    return this.listRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['tasks'],
    });
  }
  // Create a new list for a given user
  async create(name: string, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const normalizedName = name.trim();

    const existingList = await this.listRepository.findOne({
      where: {
        name: normalizedName,
        user: { id: userId },
      },
    });

    if (existingList) {
      throw new BadRequestException('List name already exists');
    }

    const list = this.listRepository.create({
      name: normalizedName,
      user,
    });

    return this.listRepository.save(list);
  }
  // Remove extra spaces from the name
  async remove(id: number, userId: number) {
    const list = await this.listRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
    });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    return this.listRepository.remove(list);
  }
}
