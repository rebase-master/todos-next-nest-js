import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { TodoStatus } from './todo.entity';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;
} 