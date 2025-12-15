import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ProfileUpdate, Profile } from './dto/profiles.dto';

export function ApiUpdateProfile() {
  return applyDecorators(
    ApiOperation({ summary: 'Update own profile' }),
    ApiBody({ type: ProfileUpdate }),
    ApiResponse({ status: 200, description: 'Profile updated' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
  );
}
