import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DeleteUserDto, LoginUserDto, SignUpUserDto, UpdateUserDto } from "src/dtos/user.dto";
import { AuthService } from "src/services/auth/auth.service";
import { UsersService } from "src/services/users/users.service";

@ApiTags('Users')
@Controller('/users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) { }

    @Get('/:username')
    getUser(@Param('username') username: string) {
        return this.usersService.getUser(username);
    }

    @Get('/')
    getUsers() {
        return this.usersService.getUsers();
    }


    @Post('signUp')
    signUpUser(@Body() userDetails: SignUpUserDto) {
        return this.authService.signUp(userDetails);
    }

    @Post('login')
    loginUser(@Body() userDetails: LoginUserDto) {
        return this.authService.Login(userDetails)
    }

    @Delete()
    deleteUser(@Body() userDetails: DeleteUserDto) {
        return this.usersService.deleteUser(userDetails)
    }

    @Patch("/:username")
    updateUser(@Param("username") username: string, @Body() changedDetails: UpdateUserDto) {
        return this.usersService.updateUser(username, changedDetails);
    }
}
