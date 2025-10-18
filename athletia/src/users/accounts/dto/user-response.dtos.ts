import { Role } from '../enum/role.enum';

export class UserItem {
  email: string;
  id: string;
  status: string;
  name: string;
}

export class User {
  email: string;
  id: string;
  status: string;
  role: Role;
  name: string;
  birthDate: Date | null;
}
