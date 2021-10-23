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
    name: "spotify_uri",
  })
  spotify_uri!: String

  @Column({
    type: "text",
    name: "name",
  })
  name!: String

  @Column({
    type: "text",
    name: "spotify_id",
  })
  spotify_id!: String

  @Column({
    type: "text",
    name: "image_url_small",
  })
  image_url_small!: String

  @Column({
    type: "text",
    name: "image_url_medium",
  })
  image_url_medium!: String

  @Column({
    type: "text",
    name: "image_url_large",
  })
  image_url_large!: String

  @Column({
    type: "text",
    name: "artist_name",
  })
  artist_name!: String

  @Column({
    type: "text",
    name: "artist_id",
  })
  artist_id!: String

  @Column({
    type: "text",
    name: "duration_ms",
  })
  duration_ms!: String

  @ManyToOne((type) => Room, (room) => room.id)
  @JoinColumn({ name: "room" })
  room!: Room

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
