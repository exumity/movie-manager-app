import { UserType } from '../../users/dto/create-user.dto';

export interface AccessTokenPayloadInterface {
  username: string;
  id: string;
  claims: { userType: UserType; age: number };
}
