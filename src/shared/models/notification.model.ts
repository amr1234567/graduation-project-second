type NotificationModel = {
  id: number;
  message: string;
  type: NotificationTypeEnum;
  isDeleting: boolean;
}
export enum NotificationTypeEnum {
  Warning = "warning",
  Success = "success",
  Error = "error",
  Alert = "alert",
}

export default NotificationModel;
