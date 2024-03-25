import { IsEmail } from "class-validator";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryColumn()
    username: string;

    @Column()
    password: string;

    @Column({
        default: 'member'
    })
    role: string;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    createdAt: Date;
}