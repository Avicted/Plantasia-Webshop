import produce from 'immer'
import { NotificationData } from '../../../models/NotificationData'
import { AccountActions, AccountActionTypes } from '../actions/AccountActions'

// State definition
interface AccountState {
    error: string
    notifications: NotificationData[]
}

const initialState: AccountState = {
    error: '',
    notifications: [],
}

export function accountReducer(state: AccountState = initialState, action: AccountActions) {
    switch (action.type) {
        case AccountActionTypes.ChangePassword:
            return produce(state, (draft) => {
                draft.error = ''
            })
        case AccountActionTypes.ChangePasswordSuccess:
            return produce(state, (draft) => {
                // Nothing to do
            })
        case AccountActionTypes.ChangePasswordError:
            return produce(state, (draft) => {
                draft.error = action.type
            })
        case AccountActionTypes.ShowNotification:
            return produce(state, (draft) => {
                draft.notifications.push(action.data)
            })
        case AccountActionTypes.HideNotification:
            return produce(state, (draft) => {
                // @Note(Victor): for now we keep all the notifications, we just toggle them as dissmissed by the user
                const n = draft.notifications.find((n) => n.id === action.notificationId)

                if (n !== undefined) {
                    n.dismissed = true
                }
            })
        default:
            return state
    }
}
