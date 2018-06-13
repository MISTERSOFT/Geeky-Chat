import { UserStatus } from './states';
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  status: UserStatus;
}
