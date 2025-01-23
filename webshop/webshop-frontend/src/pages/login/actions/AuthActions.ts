import { Action } from 'redux'
import { AuthenticationRequest } from '../../../models/AuthenticationRequest'
import { User } from '../../../models/User'

export enum AuthActionTypes {
    GetMyUserData = 'Auth/GetMyUserData',
    GetMyUserDataSuccess = 'Auth/GetMyUserDataSuccess',
    GetMyUserDataError = 'Auth/GetMyUserDataError',
    LoginRequest = 'Auth/LoginRequest',
    LoginSuccess = 'Auth/LoginSuccess',
    LoginError = 'Auth/LoginError',
    Logout = 'Auth/Logout',
}

export interface GetMyUserData extends Action {
    type: AuthActionTypes.GetMyUserData
}

export interface GetMyUserDataSuccess extends Action {
    type: AuthActionTypes.GetMyUserDataSuccess
    user: User
}

export interface GetMyUserDataError extends Action {
    type: AuthActionTypes.GetMyUserDataError
    error: string
}

export interface LoginRequest extends Action {
    type: AuthActionTypes.LoginRequest
    payload: AuthenticationRequest
}

export interface LoginSuccess extends Action {
    type: AuthActionTypes.LoginSuccess
    user: User
}

export interface LoginError extends Action {
    type: AuthActionTypes.LoginError
    error: string
}

export interface Logout extends Action {
    type: AuthActionTypes.Logout
    history: any
}

export const authActions = {
    GetMyUserData: (): GetMyUserData => ({
        type: AuthActionTypes.GetMyUserData,
    }),
    GetMyUserDataSuccess: (user: User): GetMyUserDataSuccess => ({
        type: AuthActionTypes.GetMyUserDataSuccess,
        user,
    }),
    GetMyUserDataError: (error: string): GetMyUserDataError => ({
        type: AuthActionTypes.GetMyUserDataError,
        error,
    }),
    LoginRequest: (payload: AuthenticationRequest): LoginRequest => ({
        type: AuthActionTypes.LoginRequest,
        payload,
    }),
    LoginSuccess: (user: User): LoginSuccess => ({
        type: AuthActionTypes.LoginSuccess,
        user,
    }),
    LoginError: (error: string): LoginError => ({
        type: AuthActionTypes.LoginError,
        error,
    }),
    Logout: (history: any): Logout => ({
        type: AuthActionTypes.Logout,
        history,
    }),
}

export type AuthActions =
    | GetMyUserData
    | GetMyUserData
    | GetMyUserDataSuccess
    | GetMyUserDataError
    | LoginRequest
    | LoginSuccess
    | LoginError
    | Logout
