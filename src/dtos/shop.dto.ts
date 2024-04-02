import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ShopDto {
    @ApiProperty()
    @IsString()
    shop_name: string;


    @ApiProperty()
    @IsString()
    shop_thumb?: string;
}

export class removeShopDto {
    @ApiProperty()
    shop_id: string;
}