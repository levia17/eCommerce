import { Body, Controller, Delete, Get, Header, Headers, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ShopDto, removeShopDto } from "src/dtos/shop.dto";
import { ShopService } from "src/services/shop/shop.service";

@ApiTags('Shop')
@Controller('shop')
export class ShopController {
    constructor(
        private shopService: ShopService,
    ) { }

    @Get()
    getAllShop() {
        return this.shopService.findAll();
    }

    @Get('/name/:shopName')
    getShopByName(@Param("shopName") shopName: string) {
        return this.shopService.findByShopName(shopName);
    }

    @Get('/id/:shopId')
    getShopById(@Param("shopId") shopId: string) {
        console.log('hi!');
        return this.shopService.findByShopID(shopId);
    }


    @Post()
    async createShop(@Headers('Authorization') authToken: string, @Body() shopDetails: ShopDto) {
        const create = await this.shopService.createShop(authToken, shopDetails)
            .then(data => data)
        return create;
    }

    @Delete()
    deleteShop(@Headers('Authorization') authToken, @Body() shopDetails: removeShopDto) {
        return this.shopService.deleteByShopID(authToken, shopDetails)
    }


}