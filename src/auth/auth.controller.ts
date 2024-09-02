import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/admin/register')
  async registerAdmin(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto, true);
    } catch (error) {
      this.handleException(error);
    }
  }

  @Post('/admin/login')
  async loginAdmin(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto, true);
    } catch (error) {
      this.handleException(error);
    }
  }

  @Post('/user/register')
  async registerUser(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto, false);
    } catch (error) {
      this.handleException(error);
    }
  }

  @Post('/user/login')
  async loginUser(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto, false);
    } catch (error) {
      this.handleException(error);
    }
  }

  private handleException(error: any) {
    console.error('Error in AuthController:', error);

    if (error instanceof HttpException) {
      throw error;
    } else {
      throw new HttpException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
