import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    // Service to interact with users (DB)
    private readonly usersService: UsersService,

    // Service to generate JWT tokens
    private readonly jwtService: JwtService,
  ) {}

  // ================= REGISTER =================
  async register(registerDto: RegisterDto) {
    const { firstName, lastName, email, password } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);
    // If email already used → throw error
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    // Hash password (very important for security)
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user in database
    const newUser = await this.usersService.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return {
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    };
  }
  // ================= LOGIN =================
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    // Find user by email
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    // Create JWT payload (data inside token)
    const payload = {
      sub: user.id,
      email: user.email,
    };
    // Generate token
    const access_token = await this.jwtService.signAsync(payload);
    // Return token + user info
    return {
      message: 'Login successful',
      access_token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }
}
