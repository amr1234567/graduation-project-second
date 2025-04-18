import {Component, DestroyRef, signal} from '@angular/core';
import {NotificationContext} from '../../contexts/notification.context';
import {NgClass} from '@angular/common';
import NotificationModel from '../../models/notification.model';

@Component({
  selector: 'app-notification',
  imports: [
    NgClass
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
}
