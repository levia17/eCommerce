


import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class TokenStore {
    @PrimaryColumn()
    username: string;

    @Column({
        length: 5000,
        nullable: true,
    })
    access_token: string;

    @Column({
        length: 5000,
        nullable: true,
    })
    refresh_token: string;

    @Column({
        type: "json",
    })
    refreshTokenUsed: Array<string>;
}

