import {inject, signal} from '@angular/core';
import {HttpClient, HttpContext, HttpHeaders, HttpParams} from '@angular/common/http';
import {mergeMap, Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {NotificationContext} from '../contexts/notification.context';
import {BaseApiResponse} from '../models/base-api-response.model';
import {ApiStatusCode} from '../constants/Api';
import {NotificationTypeEnum} from '../models/notification.model';
import { environment } from '../../environments/environment';

export class SharedService {
  private baseUrl = signal(environment.apiUrl);
  private httpClient = inject(HttpClient);
  protected notificationCtx = inject(NotificationContext);

  protected set setBaseUrl(baseUrl: string) {
    this.baseUrl.set(baseUrl);
  }

  protected sendPostRequest<TRes>(route: string, body: any, options?: HttpOptions): Observable<TRes | null> {
    return this.httpClient.post<TRes>(`${this.baseUrl()}${route}`, JSON.stringify(body), options)
      .pipe(catchError(e => {
        this.notificationCtx.addNotification(JSON.stringify(e.message), NotificationTypeEnum.Error)
        console.log(e);
        return throwError(e);
      }))
  }

  protected sendPostRequestWithForm<TRes>(route: string, form: FormData) {
    return this.httpClient.post<TRes>(`${this.baseUrl()}${route}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .pipe(catchError(e => {
        this.notificationCtx.addNotification(JSON.stringify(e.message), NotificationTypeEnum.Error)
        console.log(e);
        return throwError(e);
      }));
  }

  protected sendGetRequest<TRes>(route: string, options?: HttpOptions): Observable<TRes> {
    return this.httpClient.get<TRes>(`${this.baseUrl()}${route}`, options)
      .pipe(catchError(e => {
        this.notificationCtx.addNotification(JSON.stringify(e.message), NotificationTypeEnum.Error)
        console.log(e);
        return throwError(e);
      }))
  }

  protected sendDeleteRequest<TRes>(route: string, options?: HttpOptions): Observable<TRes> {
    return this.httpClient.delete<TRes>(`${this.baseUrl()}${route}`, options)
      .pipe(catchError(e => {
        this.notificationCtx.addNotification(JSON.stringify(e.message), NotificationTypeEnum.Error)
        console.log(e);
        return throwError(e);
      }))
  }

  protected sendPutRequest<TRes>(route: string, body: any, options?: HttpOptions): Observable<TRes> {
    return this.httpClient.put<TRes>(`${this.baseUrl()}${route}`, JSON.stringify(body), options)
      .pipe(catchError(e => {
        this.notificationCtx.addNotification(JSON.stringify(e.message), NotificationTypeEnum.Error)
        console.log(e);
        return throwError(e);
      }))
  }
}

interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  context?: HttpContext;
  params?: HttpParams | { [param: string]: string | number | boolean | readonly (string | number | boolean)[] };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}
