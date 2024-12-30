import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/configuration';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';
import { AccessTokenPayloadInterface } from './interfaces/access-token-payload.interface';
import { RefreshTokenPayloadInterface } from './interfaces/refresh-token-payload.interface';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<Configuration>,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new BadRequestException('Username or password is invalid');
    }

    if (user?.password && !bcrypt.compareSync(pass, user.password)) {
      throw new UnauthorizedException();
    }

    return this.generateTokens(user);
  }

  async signUp(signUpDto: SignUpDto) {
    const user = await this.usersService.create(signUpDto);
    if (!user) {
      throw new InternalServerErrorException();
    }
    return {
      id: user.id,
      ...this.generateTokens(user),
    };
  }

  async refreshAccessToken(oldRefreshToken: string) {
    const oldRefreshTokenPayload: RefreshTokenPayloadInterface =
      this.jwtService.verify(oldRefreshToken, {
        secret: this.configService.getOrThrow('jwtRefreshSecret', {
          infer: true,
        }),
      });

    const user = await this.usersService.findOne(oldRefreshTokenPayload.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.generateTokens(user);
  }

  generateTokens(user: UserDocument) {
    const payload: AccessTokenPayloadInterface = {
      username: user.username,
      id: user.id,
      claims: { userType: user.type, age: user.age },
    };
    const refreshPayload: RefreshTokenPayloadInterface = {
      username: user.username,
      id: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: this.configService.getOrThrow('jwtAccessTtlInSeconds', {
          infer: true,
        }),
      }),
      refresh_token: this.jwtService.sign(refreshPayload, {
        secret: this.configService.getOrThrow('jwtRefreshSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('JwtRefreshTtlInSeconds', {
          infer: true,
        }),
      }),
    };
  }
}
