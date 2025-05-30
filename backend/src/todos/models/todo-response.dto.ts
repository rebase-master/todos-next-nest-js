import { TodoStatus } from './todo.entity';
import { UserResponseDto } from '../../users/models/user-response.dto';

export class TodoResponseDto {
  id: number;
  name: string;
  description: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
  user: UserResponseDto;
} 