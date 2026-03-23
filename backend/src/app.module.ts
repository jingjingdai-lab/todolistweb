import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ListsModule } from './lists/lists.module';
import { TasksModule } from './tasks/tasks.module';

console.log('DB_HOST =', process.env.DB_HOST);
console.log('DB_PORT =', process.env.DB_PORT);
console.log('DB_USERNAME =', process.env.DB_USERNAME);
console.log('DB_PASSWORD =', process.env.DB_PASSWORD);
console.log('DB_DATABASE =', process.env.DB_DATABASE);

@Module({
  imports: [
    // Load environment variables from .env file and make them globally available
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configure TypeORM to connect to PostgreSQL database
    TypeOrmModule.forRoot({
      type: 'postgres',

      // Database connection settings from environment variables
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),

    // Register application modules
    AuthModule,
    UsersModule,
    ListsModule,
    TasksModule,
  ],
})
export class AppModule {}
