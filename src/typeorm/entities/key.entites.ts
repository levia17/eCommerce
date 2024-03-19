import { MaxLength } from "class-validator";
import { Column, Entity, MaxKey, PrimaryColumn } from "typeorm";

@Entity()
export class KeyStore {
    @PrimaryColumn()
    username: string;

    @Column({
        length: 2048
    })
    publicKey: string;

    @Column({
        length: 5000
    })
    privateKey: string;
}