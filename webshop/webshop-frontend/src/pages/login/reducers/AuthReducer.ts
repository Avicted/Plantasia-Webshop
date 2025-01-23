import produce from 'immer'
import { AppState } from '../../../framework/store/rootReducer'
import { User } from '../../../models/User'
import { AuthActions, AuthActionTypes } from '../actions/AuthActions'

// State definition
interface AuthState {
    user: User | undefined
    error: string
}

const initialState: AuthState = {
    user: undefined,
    error: '',
}

export function authReducer(state: AuthState = initialState, action: AuthActions) {
    switch (action.type) {
        case AuthActionTypes.GetMyUserData:
            return produce(state, (draft) => {
                draft.error = ''
            })
        case AuthActionTypes.GetMyUserDataSuccess:
            return produce(state, (draft) => {
                draft.error = ''
                draft.user = action.user
            })
        case AuthActionTypes.GetMyUserDataError:
            return produce(state, (draft) => {
                draft.error = action.type
            })
        case AuthActionTypes.LoginRequest:
            return produce(state, (draft) => {
                draft.error = ''
            })
        case AuthActionTypes.LoginSuccess:
            return produce(state, (draft) => {
                draft.error = ''
                draft.user = action.user
            })
        case AuthActionTypes.LoginError:
            return produce(state, (draft) => {
                draft.user = undefined
                draft.error = action.error
            })
        case AuthActionTypes.Logout:
            return produce(state, (draft) => {
                draft.error = ''
                draft.user = undefined
            })
        default:
            return state
    }
}

// Selector
export function isAuthenticated(state: AppState): boolean {
    if (localStorage.getItem('access_token')) {
        return true
    }

    return false
}
