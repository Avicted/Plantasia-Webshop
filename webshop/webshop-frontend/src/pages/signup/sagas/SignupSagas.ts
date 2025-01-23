import { WebshopAPI } from '../../../api/WebshopAPI'
import { call, put, takeLatest } from 'redux-saga/effects'
import { ApiResponse } from '../../../models/ApiResponse'
import { RegisterNewUser, signupActions, SignupActionTypes } from '../actions/SignupActions'
import { accountActions } from '../../account/actions/AccountActions'
import { v4 as uuidv4 } from 'uuid'
import { NotificationType } from '../../../models/NotificationData'

const webshopAPI = new WebshopAPI()

// @Note(Victor): This is where all the buissness logic lives for the SignupPage React component

// Watcher saga
export function* registerNewUserSaga() {
    yield takeLatest(SignupActionTypes.RegisterNewUser, registerNewUserFlow)
}

// Worker saga
function* registerNewUserFlow(action: RegisterNewUser) {
    try {
        // Post the user data to the API
        const response: ApiResponse<undefined> = yield call(webshopAPI.register, action.payload)
        console.log({ response })

        if (response.error) {
            yield put(
                accountActions.ShowNotification({
                    id: uuidv4(),
                    title: `Error`,
                    message: `${response.error}`,
                    type: NotificationType.Error,
                    dismissed: false,
                })
            )

            throw new Error(response.error.toString())
        } else {
            yield put(signupActions.RegisterNewUserSuccess())
            action.history.push('/login')
        }
    } catch (error) {
        yield put(signupActions.RegisterNewUserError(error as string))
    }
}
