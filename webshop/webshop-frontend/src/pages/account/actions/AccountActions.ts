import { Action } from 'redux'
import { ChangePasswordRequest } from '../../../models/ChangePasswordRequest'
import { NotificationData } from '../../../models/NotificationData'

export enum AccountActionTypes {
    ChangePassword = 'Account/ChangePassword',
    ChangePasswordSuccess = 'Account/ChangePasswordSuccess',
    ChangePasswordError = 'Account/ChangePasswordError',
    ShowNotification = 'Account/ShowNotification',
    HideNotification = 'Account/HideNotification',
}

export interface ChangePassword extends Action {
    type: AccountActionTypes.ChangePassword
    requestData: ChangePasswordRequest
}

export interface ChangePasswordSuccess extends Action {
    type: AccountActionTypes.ChangePasswordSuccess
    payload: any
}

export interface ChangePasswordError extends Action {
    type: AccountActionTypes.ChangePasswordError
    error: string
}

export interface ShowNotification extends Action {
    type: AccountActionTypes.ShowNotification
    data: NotificationData
}

export interface HideNotification extends Action {
    type: AccountActionTypes.HideNotification
    notificationId: string
}

export const accountActions = {
    ChangePassword: (requestData: ChangePasswordRequest): ChangePassword => ({
        type: AccountActionTypes.ChangePassword,
        requestData,
    }),
    ChangePasswordSuccess: (payload: any): ChangePasswordSuccess => ({
        type: AccountActionTypes.ChangePasswordSuccess,
        payload,
    }),
    ChangePasswordError: (error: string): ChangePasswordError => ({
        type: AccountActionTypes.ChangePasswordError,
        error,
    }),
    ShowNotification: (data: NotificationData): ShowNotification => ({
        type: AccountActionTypes.ShowNotification,
        data,
    }),
    HideNotification: (notificationId: string): HideNotification => ({
        type: AccountActionTypes.HideNotification,
        notificationId,
    }),
}

export type AccountActions =
    | ChangePassword
    | ChangePasswordSuccess
    | ChangePasswordError
    | ShowNotification
    | HideNotification
