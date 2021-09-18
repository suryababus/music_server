import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity('users')
export class User extends BaseEntity{

    @PrimaryColumn({
        type:'text'
    })
    id!: String;

    @Column({
        type:'text',
        name:'first_name'
    })
    name!: String;

    @Column({
        type:'text',
        name:'last_name'
    })
    email!: String;
    
}