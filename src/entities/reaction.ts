import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
export enum ReactionEnum {
    Like = 'like',
    Dislike = 'dislike',
    None = 'none'
}
@Entity("reaction")
export class Reaction extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: String

    //room_Id:song_Id:user_Id
    @Index() 
    @Column({
        type: "text",
        unique : true,
        name: "searchkey",
    })
    searchkey!: String

    @Column({
        type: "text",
        name: "reaction",
        default: "none",
    })
    reaction!: ReactionEnum

    @UpdateDateColumn()
    modified_time!: Number

    @CreateDateColumn()
    created_time!: Number
}