export enum NotificationType {
    Success = 'Success',
    Error = 'Error',
    Info = 'Info',
}

export interface NotificationData {
    id: string
    type: NotificationType
    title: string
    message: string
    dismissed: boolean
    timeToShowMilliSeconds?: number
}
