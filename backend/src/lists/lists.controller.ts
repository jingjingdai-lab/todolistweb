import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ListsService } from './lists.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

type RequestWithUser = {
  user: {
    userId: number;
    email: string;
  };
};

@Controller('lists')
@UseGuards(JwtAuthGuard)
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.listsService.findAllByUser(req.user.userId);
  }

  @Post()
  create(@Body('name') name: string, @Req() req: RequestWithUser) {
    return this.listsService.create(name, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.listsService.remove(Number(id), req.user.userId);
  }
}
