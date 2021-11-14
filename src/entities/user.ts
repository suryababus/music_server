import { BaseEntity, Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity('users')
export class User extends BaseEntity{

    @PrimaryColumn({
        type:'text'
    })
    id!: String;

    @Index()
    @Column({
        type:'text',
        name:'first_name'
    })
    name!: String;

    @Column({
        type:'text',
        name:'email'
    })
    email!: String;
    
}