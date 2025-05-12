import {Component, DestroyRef, signal} from '@angular/core';
import {NotificationContext} from '../../contexts/notification.context';
import {NgClass} from '@angular/common';
import NotificationModel, {NotificationTypeEnum} from '../../models/notification.model';
import {NgbToast} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-notification',
  imports: [
    NgbToast
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  notifications= signal<NotificationModel[]>([]);

  constructor(private deleteRef: DestroyRef, private context: NotificationContext) {
    const sub = context.notifications$.subscribe(notifications => {
      this.notifications.set(notifications);
    })
    deleteRef.onDestroy(()=> sub.unsubscribe());
  }

  onDelete(id: number){
    this.context.removeNotification(id);
  }

  getHeader(type: NotificationTypeEnum) {
    switch (type){
      case NotificationTypeEnum.Error:
        return NotificationTypeEnum.Error.toString();
      case NotificationTypeEnum.Success:
        return NotificationTypeEnum.Success.toString();
      case NotificationTypeEnum.Warning:
        return NotificationTypeEnum.Warning.toString();
      case NotificationTypeEnum.Alert:
        return NotificationTypeEnum.Alert.toString();
    }
  }
}
