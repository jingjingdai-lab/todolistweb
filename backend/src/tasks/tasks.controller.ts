import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // ✅ 获取所有任务
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  // ✅ 创建任务
  @Post()
  create(
    @Body('title') title: string,
    @Body('shortDescription') shortDescription: string,
    @Body('description') description: string,
    @Body('dueDate') dueDate: string,
    @Body('taskListId') taskListId: number,
  ) {
    return this.tasksService.create(
      title,
      shortDescription,
      description,
      dueDate,
      taskListId,
    );
  }

  //删除任务
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(Number(id));
  }

  // ✅ 切换状态
  @Patch(':id/toggle')
  toggle(@Param('id') id: string) {
    return this.tasksService.toggleStatus(Number(id));
  }
}
