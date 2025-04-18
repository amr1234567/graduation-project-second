import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode'; // Adjust based on your version
import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import {StorageKey} from '../constants/storage-keys.constants';
import TokenModel from '../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class TokenServices {
  private _cookieService = inject(CookieService);
  private _localStorageServices = inject(LocalStorageService);

  // Save tokens to both localStorage and cookies with expiration dates
  saveTokenAndRefreshToken(tokenModel: TokenModel): void {
    // Save access token
    this._localStorageServices.saveObject(StorageKey.AccessToken, tokenModel.token);
    this._localStorageServices.saveObject(StorageKey.AccessTokenExpireDate, tokenModel.tokenExpirationDate);
    this._cookieService.set(
      StorageKey.AccessToken,
      tokenModel.token,
      { expires: tokenModel.tokenExpirationDate }
    );
    // Save refresh token
    this._localStorageServices.saveObject(StorageKey.RefreshToken, tokenModel.refreshToken);
    this._localStorageServices.saveObject(StorageKey.RefreshTokenExpireDate, tokenModel.refreshTokenExpirationDate);
    this._cookieService.set(
      StorageKey.RefreshToken,
      tokenModel.refreshToken,
      { expires: tokenModel.refreshTokenExpirationDate }
    );
  }

  // Delete tokens from all storage locations
  deleteAllTokens(): void {
    this._localStorageServices.deleteObject(StorageKey.AccessToken);
    this._localStorageServices.deleteObject(StorageKey.AccessTokenExpireDate);
    this._cookieService.delete(StorageKey.AccessToken);

    this._localStorageServices.deleteObject(StorageKey.RefreshToken);
    this._localStorageServices.deleteObject(StorageKey.RefreshTokenExpireDate);
    this._cookieService.delete(StorageKey.RefreshToken);
  }

  // Get token with fallback to cookies
  getToken(): string | null {
    let token = this._localStorageServices.getObject<string>(StorageKey.AccessToken);

    if (!token) {
      token = this._cookieService.get(StorageKey.AccessToken);
      if (token) {
        // Migrate to localStorage if found in cookies
        this._localStorageServices.saveObject(StorageKey.AccessToken, token);
        const expireDate = this._cookieService.get(StorageKey.AccessTokenExpireDate);
        if (expireDate) {
          this._localStorageServices.saveObject(StorageKey.AccessTokenExpireDate, expireDate);
        }
      }
    } else {
      // If token exists in local storage but not in cookies, set the cookie.
      if (!this._cookieService.get(StorageKey.AccessToken)) {
        const customDate = new Date();
        const date = new Date(this._localStorageServices.getObject<string>(StorageKey.AccessTokenExpireDate) || "") ;
        if (!date)
          customDate.setDate(customDate.getDate() + 7);
        this._cookieService.set(StorageKey.AccessToken, token, date || customDate);
      }
    }

    return token || null;
  }

  // Get refresh token with fallback to cookies
  getRefreshToken(): string | null {
    let refreshToken = this._localStorageServices.getObject<string>(StorageKey.RefreshToken);

    if (!refreshToken) {
      refreshToken = this._cookieService.get(StorageKey.RefreshToken);
      if (refreshToken) {
        // Migrate to localStorage if found in cookies
        this._localStorageServices.saveObject(StorageKey.RefreshToken, refreshToken);
        const expireDate = this._cookieService.get(StorageKey.RefreshTokenExpireDate);
        if (expireDate) {
          this._localStorageServices.saveObject(StorageKey.RefreshTokenExpireDate, expireDate);
        }
      }
    } else {
      // If token exists in local storage but not in cookies, set the cookie.
      if (!this._cookieService.get(StorageKey.RefreshToken)) {
        const customDate = new Date();
        const date = this._localStorageServices.getObject<Date>(StorageKey.RefreshTokenExpireDate) ;
        if (!date)
          customDate.setDate(customDate.getDate() + 7);
        this._cookieService.set(StorageKey.RefreshToken, refreshToken, date || customDate);
      }
    }

    return refreshToken || null;
  }

  /**
   * Decodes the provided token and retrieves the specified claim,
   * always returning an array of strings.
   * @param token The JWT token.
   * @param claimName The claim name to retrieve.
   */
  getClaim(token: string, claimName: string): string[] {
    try {
      const decodedToken = jwtDecode<{ [key: string]: any }>(token);
      const claimValue = decodedToken[claimName];
      if (claimValue === undefined || claimValue === null) {
        return [];
      }
      return Array.isArray(claimValue) ? claimValue.map(String) : [String(claimValue)];
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return [];
    }
  }

  /**
   * Retrieves the specified claim from the current stored token,
   * always returning an array of strings.
   * @param claimName The claim name to retrieve.
   */
  getClaimFromExistingToken(claimName: string): string[] {
    try {
      const token = this.getToken();
      if (!token) {
        return [];
      }
      const decodedToken = jwtDecode<{ [key: string]: any }>(token);
      const claimValue = decodedToken[claimName];
      if (claimValue === undefined || claimValue === null) {
        return [];
      }
      return Array.isArray(claimValue) ? claimValue.map(String) : [String(claimValue)];
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return [];
    }
  }

  isClaimExist(token: string, claimName: string): boolean {
    const claimValue = this.getClaim(token, claimName);
    return claimValue.length > 0;
  }

  isValueInClaim(token: string, claimName: string, value: string): boolean {
    const claimValue = this.getClaim(token, claimName);
    return claimValue.includes(value);
  }
}
