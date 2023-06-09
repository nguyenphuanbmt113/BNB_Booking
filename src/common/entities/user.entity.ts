import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IsBoolean, IsEmail, IsString } from 'class-validator';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import BaseClassEntity from './global/base-entity.entity';
import { Role } from './role.entity';
import { Reservation } from './reservation.entity';
import { Review } from './review.entity';
import { Room } from './room.entity';
import { List } from './list.entity';

@Entity()
export class User extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  firstName: string;

  @Column()
  @IsString()
  lastName: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ select: false })
  @IsString()
  password: string;

  // @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  // @IsDate()
  // lastLogin: Date;

  @Column({ default: false })
  @IsBoolean()
  verifiedEmail: boolean;

  @Column({ nullable: true })
  refresh_token: string;

  // @Column({ length: 500, nullable: true })
  // @IsString()
  // bio: string;

  @Column({ nullable: true })
  @IsString()
  avatar: string;

  @OneToMany(() => Role, (role) => role.user, { eager: true })
  roles: Role[];

  @ManyToMany(() => Reservation, (reservation) => reservation.guests)
  reservations: Reservation[];

  @OneToMany(() => List, (list) => list.owner)
  saveLists: List[];

  @OneToMany(() => Room, (room) => room.host)
  rooms: Room[];

  @OneToMany(() => Review, (review) => review.guest)
  reviews: Review[];

  // ===== Inverse side Relation =====

  // ===== Security =====
  @BeforeInsert()
  // @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        const saltOrRounds = 10;
        this.password = await bcrypt.hash(this.password, saltOrRounds);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  // ===== Methods =====
  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
