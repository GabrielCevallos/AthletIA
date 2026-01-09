import * as dotenv from 'dotenv';

dotenv.config();

export const messages = {
  registered: 'Registered successfully!',
  invalidCredentials: 'Invalid credentials',
  accountSaved: 'Account was registered, continue with profile setup',
  unprofiledAccount:
    'Account exists but profile is not set up, continue with profile setup',
  inactiveAccount: 'Account is inactive, contact support',
  suspendedAccount: 'Account is suspended, contact support',
  profileSetupCompleted: 'Profile setup completed successfully',
  activeAccount: 'Account is already active, please sign in',
  invalidAccountId: 'Invalid account ID',
  profileAlreadySetUp: 'Profile is already set up for this account',
  accountAlreadySetUp: 'This account has already been set up',
  passwordChanged: 'Password changed successfully',
  emailNotVerified: 'Email is not verified',
  verificationEmailSent: 'We have sent a verification email to your inbox',
  emailAlreadyVerified: 'Email is already verified',
  tooManyVerificationRequests:
    'Too many verification email requests. Try again later.',
  deactivatedAccount: 'Account is deactivated, contact support',
};

export const jwtConstants = {
  secret: process.env.JWT_SECRET_KEY,
  // expiration in seconds
  refreshExpiration: 60 * 60 * 24 * 7, // 7 days
  accessExpiration: 60 * 60, // 1 hour
};

export const domain = process.env.DOMAIN || 'http://localhost:3000';
