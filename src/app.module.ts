import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users.module';
import { User } from './typeorm/entities/user.entity';
import { AuthService } from './services/auth/auth.service';
import { AuthModule } from './modules/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { KeyStore } from './typeorm/entities/key.entites';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'Toilatranhoangnhu1997',
    database: 'ecommerce',
    entities: [User, KeyStore],
    synchronize: true,
  }), UsersModule, AuthModule,
  JwtModule.register({
    global: true,
  })
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class AppModule { }
