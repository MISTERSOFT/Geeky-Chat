export interface User {
  id: string;
  username: string;
  email: string;
}

export interface NewUser extends User {
  password: string;
}
