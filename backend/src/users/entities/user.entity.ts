import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TaskList } from '../../lists/entities/task-list.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => TaskList, (taskList) => taskList.user)
  taskLists: TaskList[];
}
