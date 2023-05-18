import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import BaseClassEntity from './global/base-entity.entity';

@Entity()
export class PasswordConfirmEntity extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  token_password: string;

  @Column()
  timestamp: Date;
}
