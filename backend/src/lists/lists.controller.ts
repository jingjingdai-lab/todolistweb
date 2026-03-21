import { Body, Controller, Get, Post } from '@nestjs/common';
import { ListsService } from './lists.service';
import { Delete, Param } from '@nestjs/common';

@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get()
  findAll() {
    return this.listsService.findAll();
  }

  @Post()
  create(@Body('name') name: string) {
    return this.listsService.create(name);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listsService.remove(Number(id));
  }
}
