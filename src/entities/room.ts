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
import { Song } from "./song"
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

  @Column({
    type: "text",
    name: "song_spotify_uri",
  })
  song_spotify_uri!: String

  @Column({
    type: "text",
    name: "song_spotify_image",
  })
  song_spotify_image!: String

  @ManyToOne((type) => User, (user) => user.id)
  created_by!: User

  @CreateDateColumn()
  created_time!: Number

  @ManyToOne((type) => User, (user) => user.id)
  modified_by!: User

  @UpdateDateColumn()
  modified_time!: Number

  @OneToMany(() => Song, (song) => song.room)
  songs!: Song[]
}
