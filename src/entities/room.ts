import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "./user"

@Entity("room")
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: String

  @Column({
    type: "text",
    name: "name",
  })
  name!: String

  @ManyToOne(
    type => User,
    user => user.id
  )
  created_by!: User

  @CreateDateColumn()
  created_time!: Number

  @ManyToOne(
    type => User,
    user => user.id
  )
  modified_by!: String

  @UpdateDateColumn()
  modified_time!: Number

  //TODO add columns
}
