export default interface TokenModel{
  tokenExpirationDate: Date;
  token: string;
  refreshToken: string;
  refreshTokenExpirationDate: Date;
}
