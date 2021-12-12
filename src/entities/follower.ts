import { BaseEntity, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";


@Entity("follower")
export class Follower extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: String

    //hash index this column
    @ManyToOne((type) => User, (user) => user.id)
    @JoinColumn({ name: "user" })
    user!: User

    //hash index this column
    @Index(
        
    )
    @ManyToOne((type) => User, (user) => user.id)
    @JoinColumn({ name: "following" })
    following!: User

    @UpdateDateColumn()
    modified_time!: Number

    @CreateDateColumn()
    created_time!: Number
}