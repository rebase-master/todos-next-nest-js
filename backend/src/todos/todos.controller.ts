import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './models/create-todo.dto';
import { TodoResponseDto } from './models/todo-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseDto } from '../users/models/user-response.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async findAllTodos(): Promise<TodoResponseDto[]> {
    return this.todosService.findAllTodos();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTodo(
    @Body() createTodoDto: CreateTodoDto,
    @Request() req: { user: UserResponseDto },
  ): Promise<TodoResponseDto> {
    return this.todosService.createTodo(createTodoDto, req.user);
  }

  @Get('my-todos')
  @UseGuards(JwtAuthGuard)
  async findMyTodos(@Request() req: { user: UserResponseDto }): Promise<TodoResponseDto[]> {
    return this.todosService.findUserTodos(req.user.id);
  }
} 