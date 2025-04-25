import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';
import NotificationModel, {NotificationTypeEnum} from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationContext {
  private notifications = new BehaviorSubject<NotificationModel[]>([]);

  public notifications$ = this.notifications.asObservable();

  public addNotification = (message: string, type: NotificationTypeEnum, timeDeleteOut?: number): void => {
    const id = Math.random();
    this.notifications.next([
      ...this.notifications.value,
      {
        id,
        delay: timeDeleteOut ?? 5000,
        message,
        type
      }
    ]);
  }

  public removeNotification = (id: number) => {
      this.notifications.next([...this.notifications.value.filter(n => n.id !== id)]);
  }
}
