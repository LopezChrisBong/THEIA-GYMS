import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import HeaderAPIKeyStrategy from 'passport-headerapikey';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'api-key'
) {
  constructor() {
    super(
      { header: 'X-API-KEY', prefix: '' },
      false // passReqToCallback
    );
  }

  async validate(apiKey: string): Promise<any> {
    if (process.env.API_KEY && apiKey === process.env.API_KEY) {
      // return any payload or user object; here we just return the API key
      return { apiKey };
    }
    throw new UnauthorizedException('Invalid API Key');
  }
}
