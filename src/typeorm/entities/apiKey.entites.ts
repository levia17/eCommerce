import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ApiKey {

    @PrimaryColumn({ unique: true })
    apiKeyCode: string;

    @Column()
    status: boolean;

    @Column()
    permission: string;

    @Column()
    createAt: Date;


}