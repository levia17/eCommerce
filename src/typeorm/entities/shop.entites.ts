import { IsString } from "class-validator";
import { Column, Entity, ObjectId, ObjectIdColumn, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Shop {
    @PrimaryGeneratedColumn('uuid')
    shop_id: string;
    
    @Column()
    shop_name: string;
    
    @Column({ nullable: true, default: null })
    shop_thumb: string;
    
    @Column()
    shop_owner: string;
}