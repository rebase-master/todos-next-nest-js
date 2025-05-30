import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/models/create-user.dto';
import { LoginDto } from './models/login.dto';
import { AuthResponseDto } from './models/auth-response.dto';
import { UserResponseDto } from '../users/models/user-response.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const user = await this.usersService.createUser(createUserDto);
    const accessToken = this.generateJwtToken(user);

    return {
      accessToken,
      user,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { identifier, password } = loginDto;

    // Find user by email or username
    let user = await this.usersService.findByEmail(identifier);
    
    if (!user) {
      user = await this.usersService.findByUsername(identifier);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const userResponse = await this.usersService.findById(user.id);
    const accessToken = this.generateJwtToken(userResponse);

    return {
      accessToken,
      user: userResponse,
    };
  }

  private generateJwtToken(user: UserResponseDto): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.sign(payload);
  }
} 