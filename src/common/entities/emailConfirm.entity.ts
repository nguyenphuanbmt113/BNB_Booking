import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import BaseClassEntity from './global/base-entity.entity';

@Entity()
export class EmailConfirmEntity extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  token_email: string;

  @Column()
  timestamp: Date;
}
