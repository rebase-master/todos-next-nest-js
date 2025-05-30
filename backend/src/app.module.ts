import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { User } from './users/models/user.entity';
import { Todo } from './todos/models/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Todo],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    TodosModule,
  ],
})
export class AppModule {} 