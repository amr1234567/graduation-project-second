export default interface UserModel {
  token: string;
  accessToken: string;
  claims : {key: string, value: string}[];
  role : UserRoleType;
}

export type UserRoleType = "User" | "Admin";
