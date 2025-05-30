import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './models/todo.entity';
import { CreateTodoDto } from './models/create-todo.dto';
import { TodoResponseDto } from './models/todo-response.dto';
import { UserResponseDto } from '../users/models/user-response.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async createTodo(createTodoDto: CreateTodoDto, user: UserResponseDto): Promise<TodoResponseDto> {
    const todo = this.todoRepository.create({
      ...createTodoDto,
      userId: user.id,
    });

    const savedTodo = await this.todoRepository.save(todo);
    
    return this.mapToResponseDto(savedTodo, user);
  }

  async findAllTodos(): Promise<TodoResponseDto[]> {
    const todos = await this.todoRepository.find({
      relations: ['user'],
    });

    return todos.map(todo => this.mapToResponseDto(todo, {
      id: todo.user.id,
      email: todo.user.email,
      username: todo.user.username,
      createdAt: todo.user.createdAt,
      updatedAt: todo.user.updatedAt,
    }));
  }

  async findUserTodos(userId: number): Promise<TodoResponseDto[]> {
    const todos = await this.todoRepository.find({
      where: { userId },
      relations: ['user'],
    });

    return todos.map(todo => this.mapToResponseDto(todo, {
      id: todo.user.id,
      email: todo.user.email,
      username: todo.user.username,
      createdAt: todo.user.createdAt,
      updatedAt: todo.user.updatedAt,
    }));
  }

  private mapToResponseDto(todo: Todo, user: UserResponseDto): TodoResponseDto {
    return {
      id: todo.id,
      name: todo.name,
      description: todo.description,
      status: todo.status,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
      user,
    };
  }
} 