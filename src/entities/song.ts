import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("song")
export class Song extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: String
    
    @Column({
        type: "text",
        name: "sportify_id",
    })
    sportify_id!: String

    @Column({
        type: "text",
        name: "room_id",
    })
    room_id!: String

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
        name: "dis_likes",
    })
    dis_likes!: Number

    @Column({
        type: "text",
        name: "added_by",
    })
    added_by!: String

    @CreateDateColumn()
    added_time!: Number
}