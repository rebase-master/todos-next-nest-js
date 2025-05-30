import { UserResponseDto } from '../../users/models/user-response.dto';

export class AuthResponseDto {
  accessToken: string;
  user: UserResponseDto;
} 