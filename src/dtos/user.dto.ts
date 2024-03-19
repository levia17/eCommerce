import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";


class SignUpUserDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    confirmPassword: string;

    @ApiProperty({ nullable: true })
    @IsEmail({})
    email: string;

}

class LoginUserDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;
}

class DeleteUserDto {
    @ApiProperty()
    username: string;
}

class UpdateUserDto {
    @ApiProperty()
    password: string;

    @ApiProperty()
    email: string;
}

export { SignUpUserDto, LoginUserDto, DeleteUserDto, UpdateUserDto }

