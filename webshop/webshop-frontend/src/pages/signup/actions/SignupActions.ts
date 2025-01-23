import { Action } from 'redux'
import { RegisterNewUserRequest } from '../../../models/RegisterNewUserRequest'

export enum SignupActionTypes {
    RegisterNewUser = 'Signup/RegisterNewUser',
    RegisterNewUserSuccess = 'Signup/RegisterNewUserSuccess',
    RegisterNewUserError = 'Signup/RegisterNewUserError',
}

export interface RegisterNewUser extends Action {
    type: SignupActionTypes.RegisterNewUser,
    payload: RegisterNewUserRequest,
    history: any
}

export interface RegisterNewUserSuccess extends Action {
    type: SignupActionTypes.RegisterNewUserSuccess,
}

export interface RegisterNewUserError extends Action {
    type: SignupActionTypes.RegisterNewUserError,
    error: string
}

export const signupActions = {
    RegisterNewUser: (payload: RegisterNewUserRequest, history: any): RegisterNewUser => ({
        type: SignupActionTypes.RegisterNewUser,
        payload,
        history,
    }),
    RegisterNewUserSuccess: (): RegisterNewUserSuccess => ({
        type: SignupActionTypes.RegisterNewUserSuccess
    }),
    RegisterNewUserError: (error: string): RegisterNewUserError => ({
        type: SignupActionTypes.RegisterNewUserError,
        error,
    })
}

export type SignupActions = 
    | RegisterNewUser
    | RegisterNewUserSuccess
    | RegisterNewUserError