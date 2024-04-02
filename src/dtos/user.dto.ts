import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEmail, IsOptional, IsString } from "class-validator";


class SignUpUserDto {
    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsString()
    confirmPassword: string;

    @ApiProperty({ nullable: true })
    @IsEmail()
    email: string;

    @ApiProperty({ default: [] })
    @IsArray()
    own_store: Array<string>;

}

class LoginUserDto {
    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    password: string;
}

class DeleteUserDto {
    @ApiProperty()
    @IsString()
    username: string;
}

class UpdateUserDto {
    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsString()
    password?: string;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsEmail()
    email?: string;
}

export { SignUpUserDto, LoginUserDto, DeleteUserDto, UpdateUserDto }

