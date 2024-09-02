import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto, isAdmin: boolean): Promise<any> {
    try {
      const { name, email, password } = registerDto;
      const userExists = await this.userModel.findOne({ email });

      if (userExists) {
        throw new BadRequestException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new this.userModel({
        name,
        email,
        password: hashedPassword,
        isAdmin,
        createdAt: new Date(),
      });

      await user.save();

      // Generate a JWT token
      const token = this.jwtService.sign(
        { id: user._id, isAdmin: user.isAdmin, email: user.email },
        {
          secret: isAdmin
            ? process.env.JWT_SECRET_ADMIN
            : process.env.JWT_SECRET_USER,
          expiresIn: '1h',
        },
      );

      return { name: name, email: email, token, expiresIn: '1h' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Could not register user');
    }
  }
  async login(loginDto: LoginDto, isAdmin: boolean): Promise<any> {
    try {
      const { email, password } = loginDto;
      const user = await this.userModel.findOne({ email, isAdmin });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate JWT token
      const token = this.jwtService.sign(
        { id: user._id, isAdmin: user.isAdmin },
        {
          secret: isAdmin
            ? process.env.JWT_SECRET_ADMIN
            : process.env.JWT_SECRET_USER,
          expiresIn: '1h',
        },
      );

      return { email: email, token, expiresIn: '1h' };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Could not log in user');
    }
  }
}
