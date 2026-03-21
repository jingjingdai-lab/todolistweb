import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { TaskList } from './entities/task-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskList])],
  controllers: [ListsController],
  providers: [ListsService],
  exports: [TypeOrmModule],
})
export class ListsModule {}
