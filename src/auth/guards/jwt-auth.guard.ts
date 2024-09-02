import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard {
  private readonly jwtSecretAdmin: string;
  private readonly jwtSecretUser: string;

  constructor() {
    // Get the JWT secret from environment variables or any other source
    this.jwtSecretAdmin = process.env.JWT_SECRET_ADMIN;
    this.jwtSecretUser = process.env.JWT_SECRET_USER;
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('JWT token missing');
    }

    try {
      // Verify the token using jsonwebtoken directly
      console.log('first try');
      const decoded = jwt.verify(token, this.jwtSecretAdmin);
      console.log('fist try', decoded);
      request.user = decoded;
    } catch (error) {
      try {
        // Verify the token using jsonwebtoken directly
        const decoded = jwt.verify(token, this.jwtSecretUser);
        console.log('second try', decoded);
        request.user = decoded;
      } catch (error) {
        throw new UnauthorizedException('Invalid JWT token');
      }
    }

    return true;
  }

  extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }
}
