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

  // Get all tasks (with their related task list)
  findAll() {
    return this.taskRepository.find({
      relations: ['taskList'],
    });
  }

  // Create a new task
  async create(
    title: string,
    shortDescription: string,
    description: string,
    dueDate: string,
    taskListId: number,
  ) {
    const task = this.taskRepository.create({
      title,
      shortDescription,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      status: 'TODO',
      taskList: { id: taskListId },
    });

    return this.taskRepository.save(task);
  }

  // Toggle task status (TODO ↔ DONE)
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
  // Delete a task by id
  async remove(id: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    await this.taskRepository.remove(task);

    return { message: 'Task deleted successfully' };
  }
}
