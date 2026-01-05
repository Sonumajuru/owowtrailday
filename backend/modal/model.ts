export interface User {
  UserId: string;
  Name?: string | null;
  Role: UserRole;
  Options: UserOptions;
  Email: string;
  PasswordHash?: string | null;
  PasswordSalt?: string | null;
  ProfilePicture?: string | null;
  PhoneNumber?: string | null;
  Optional?: string | null;
  IsDeleted?: boolean | null;
  CreatedAt?: Date | null;
  ModifiedAt?: Date | null;
}

export interface UserDTO {
  UserId: string;
  Name?: string;
  Role: UserRole;
  Options: UserOptions;
  Email: string;
  ProfilePicture?: string;
  PhoneNumber?: string;
  Optional?: string;
}

export enum UserRole {
  User = 'User',
  Guest = 'Guest',
}

export enum UserOptions {
  Boss = 'Boss',
  Developer = 'Developer',
  Designer = 'Designer',
  Intern = 'Intern',
}
