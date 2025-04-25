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
        return "خطأ";
      case NotificationTypeEnum.Success:
        return "نجاح";
      case NotificationTypeEnum.Warning:
        return "انتبه";
      case NotificationTypeEnum.Alert:
        return "تحذير";
    }
  }
}
