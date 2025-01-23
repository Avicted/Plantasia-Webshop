import produce from "immer";
import { SignupActions, SignupActionTypes } from "../actions/SignupActions";

// State definition
interface SignupState {
    error: string
}

const initialState: SignupState = {
    error: '',
}

export function signupReducer(state: SignupState = initialState, action: SignupActions) {
    switch (action.type) {
        case SignupActionTypes.RegisterNewUser:
            return produce(state, (draft) => {
                draft.error = ''
            })
        case SignupActionTypes.RegisterNewUserSuccess:
            return produce(state, (draft) => {
                draft.error = ''
            })
        case SignupActionTypes.RegisterNewUserError:
            return produce(state, (draft) => {
                draft.error = action.error
            })
    
        default:
            return state
    }
}