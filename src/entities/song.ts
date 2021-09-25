import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room";
import { User } from "./user";

@Entity("song")
export class Song extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: String
    
    @Column({
        type: "text",
        name: "spotify_url",
    })
    spotify_url!: String

    @Column({
        type: "text",
        name: "room_id",
    })
    room_id!: Song

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

    @ManyToOne(
        type => User,
        user => user.id
    )
    added_by!: User

    @CreateDateColumn()
    added_time!: Number

}