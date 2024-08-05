import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'boolean', default: false })
  is_enabled: boolean;

  @Column({ type: 'varchar', length: 500 })
  interval: string;

  @Column({ type: 'bigint', nullable: true })
  last_run: number;

  @Column({ type: 'bigint', nullable: true })
  next_run: number;

  @Column({ type: 'json', nullable: true })
  meta_data: Record<any, any> | null;
}
