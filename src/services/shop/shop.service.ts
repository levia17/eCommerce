import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { TokenService } from "../auth/token.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Shop } from "src/typeorm/entities/shop.entites";
import { JsonContains, Repository } from "typeorm";
import { ShopParam, removeShopParam } from "src/type/shop.type";
import { User } from "src/typeorm/entities/user.entity";
import { ValidationUtils } from "src/utils/validation.util";



@Injectable()
export class ShopService {
    constructor(
        private tokenService: TokenService,
        @InjectRepository(Shop) private shopRepository: Repository<Shop>,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }

    findAll() {
        return this.shopRepository.find();
    }

    findByShopName(shopName: string) {
        return this.shopRepository.findOneBy({ shop_name: shopName });
    }

    findByShopID(shopId: string) {
        console.log('hi!');
        return this.shopRepository.findOneBy({ shop_id: shopId });
    }

    async createShop(authToken: string, shopDetails: ShopParam) {
        const checkExistedShopName = await this.findByShopName(shopDetails.shop_name)
            .then(data => data ? data : null)
            .catch(err => { throw err });
        if (checkExistedShopName) {
            throw new BadRequestException("Shop's name is existed!");
        }

        const verify = await this.tokenService.verifyAccessToken(authToken)
            .then(data => data)
            .catch(err => err)
        if (!verify) {
            throw new BadRequestException("Cannot verify!");
        }


        const newShop = this.shopRepository.create({
            ...shopDetails,
            shop_owner: verify.username
        })
        const create = await this.shopRepository.save(newShop)
            .then(data => data)
            .catch(err => err);

        const user = await this.userRepository.findOneBy({ username: verify.username })
            .then(data => data)
            .catch(err => { throw new NotFoundException("User is not existed!") });
        if (user) {
            if (!user.own_store) {
                user.own_store = []; // Initialize if null
            }
            user.own_store = [...user.own_store, create.shop_id];
            await this.userRepository.save(user);
        }

        return create;
    }

    async deleteByShopID(authToken: string, shopDetails: removeShopParam) {
        const validator = ValidationUtils(["shop_id"], shopDetails);
        if (!validator) {
            throw new BadRequestException("Invalid! V");
        }
        const verify = await this.tokenService.verifyAccessToken(authToken)
            .then(data => data ? data : undefined)
            .catch(err => { throw err });

        const removedId = shopDetails.shop_id;

        const user = await this.userRepository.createQueryBuilder('user')
            .where("JSON_CONTAINS(user.own_store, :shopId)", { shopId: `"${removedId}"` })
            .getOne();

        if (user.username !== verify.username) {
            throw new BadRequestException("You not enough permission!");
        }


        if (!user) {
            throw new BadRequestException("Can not get own store");
        }

        user.own_store = await user.own_store.filter(shopID => shopID !== removedId)
        this.userRepository.update(user.username, { own_store: user.own_store });

        return this.shopRepository.delete(shopDetails);
    }
}