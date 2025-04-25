export default interface UserModel {
  token: string;
  role : UserRoleType;
  email: string;
  userId: string;
}

export type UserRoleType = "User" | "Admin";
