import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { domain } from '../constants';

const myEnv = dotenv.config();
dotenvExpand.default(myEnv);

export type GoogleUser = {
  provider: 'google';
  sub: string; // google profile id
  email: string;
  name?: string;
  picture?: string;
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL || `${domain}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): GoogleUser {
    const email = profile.emails?.[0]?.value;
    return {
      provider: 'google',
      sub: profile.id,
      email: email || '',
      name: profile.displayName,
      picture: profile.photos?.[0]?.value,
    };
  }
}
