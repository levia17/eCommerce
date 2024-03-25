import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DeleteUserDto, LoginUserDto, SignUpUserDto, UpdateUserDto } from "src/dtos/user.dto";
import { AuthService } from "../services/auth/auth.service";
import { UsersService } from "src/services/users/users.service";
import { ApiKeyCheck } from "src/decorators/apiKey.decorator";
import { refreshTokenDto } from "src/dtos/token.dto";

@ApiTags('Users')
@Controller('/users')
// @ApiKeyCheck('admin2017')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) { }

    @Get('/:username')
    @ApiKeyCheck('admin27017')
    async getUser(@Param('username') username: string) {
        const user = await this.usersService.getUser(username)

        if (!user) {
            throw new NotFoundException('Not found user!');
        }

        return user;
    }

    @Get('/')
    @ApiKeyCheck('admin27017')
    getUsers() {
        return this.usersService.getUsers();
    }


    @Post('signUp')
    @ApiKeyCheck('admin27017')
    async signUpUser(@Body() userDetails: SignUpUserDto) {
        return this.authService.signUp(userDetails);
    }

    @Post('login')
    @ApiKeyCheck('admin27017')
    loginUser(@Body() userDetails: LoginUserDto) {
        return this.authService.Login(userDetails)
    }

    @Delete()
    @ApiKeyCheck('admin27017')
    deleteUser(@Body() userDetails: DeleteUserDto) {
        return this.usersService.deleteUser(userDetails)
            .then(_ => { return { statusCode: 200, message: "Deleted user!" } })
            .catch(err => { throw new InternalServerErrorException() })
    }

    @Patch("/:username")
    @ApiKeyCheck('admin27017')
    updateUser(@Param("username") username: string, @Body() changedDetails: UpdateUserDto) {
        return this.usersService.updateUser(username, changedDetails)
            .then(_ => { return { statusCode: 200, message: `Update ${changedDetails} successfully` } })
            .catch(err => { throw new InternalServerErrorException() });
    }
}
