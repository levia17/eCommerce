import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class KeyStore {
    @PrimaryColumn()
    username: string;

    @Column({
        length: 5000
    })
    publicKey: string;

    @Column({
        length: 5000
    })
    privateKey: string;
}