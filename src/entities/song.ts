import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { Room } from "./room"
import { User } from "./user"

@Entity("song")
export class Song extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: String

  @Column({
    type: "text",
    name: "spotify_url",
  })
  spotify_url!: String

  @ManyToOne((type) => Room, (room) => room.id)
  @JoinColumn({ name: "room" })
  room!: Room

  @Column({
    type: "text",
    name: "name",
  })
  name!: String

  @Column({
    type: "int",
    name: "likes",
  })
  likes!: Number

  @Column({
    type: "int",
    name: "dislikes",
  })
  dislikes!: Number

  @ManyToOne((type) => User, (user) => user.id)
  @JoinColumn({ name: "added_by" })
  added_by!: User

  @Column({
    type: "text",
    name: "added_by_user_name",
  })
  added_by_user_name!: String

  @CreateDateColumn()
  added_time!: Number
}
