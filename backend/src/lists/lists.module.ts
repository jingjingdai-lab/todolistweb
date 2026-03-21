import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { TaskList } from './entities/task-list.entity';
import { User } from '../users/entities/user.entity';
import { AuthModule } from '../auth/auth.module'; // ⭐ 加这个

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskList, User]),
    AuthModule, // ⭐ 关键
  ],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}
