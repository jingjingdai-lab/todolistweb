import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // ✅ 获取所有任务
  findAll() {
    return this.taskRepository.find({
      relations: ['taskList'], // 如果你不需要 list，可以删掉这一行
    });
  }

  // ✅ 创建任务
  async create(title: string, taskListId: number) {
    const task = this.taskRepository.create({
      title,
      status: 'TODO',
      taskList: { id: taskListId }, // ⭐ 关键！
    });

    return this.taskRepository.save(task);
  }

  // ✅ 切换任务状态（TODO / DONE）
  async toggleStatus(id: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    task.status = task.status === 'TODO' ? 'DONE' : 'TODO';

    return this.taskRepository.save(task);
  }
}
