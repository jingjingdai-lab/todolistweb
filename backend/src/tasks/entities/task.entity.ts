import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TaskList } from '../../lists/entities/task-list.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'TODO' })
  status: string;

  @Column({ nullable: true })
  dueDate: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => TaskList, (taskList) => taskList.tasks, {
    onDelete: 'CASCADE',
  })
  taskList: TaskList;
}
