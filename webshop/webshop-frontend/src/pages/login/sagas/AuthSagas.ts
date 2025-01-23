import { call, put, takeLatest } from '@redux-saga/core/effects'
import { WebshopAPI } from '../../../api/WebshopAPI'
import { ApiResponse } from '../../../models/ApiResponse'
import { User } from '../../../models/User'
import { accountActions } from '../../account/actions/AccountActions'
import { v4 as uuidv4 } from 'uuid'

import { authActions, AuthActionTypes, GetMyUserData, LoginRequest, Logout } from '../actions/AuthActions'
import { NotificationType } from '../../../models/NotificationData'

const webshopAPI = new WebshopAPI()

// @Note(Victor): This is where all the buissness logic lives for authenticating through JWT

// Watcher saga
export function* loginSaga() {
    yield takeLatest(AuthActionTypes.LoginRequest, loginFlow)
}

// Worker saga
function* loginFlow(action: LoginRequest) {
    try {
        // Post the credentials to the API
        const apiResponse: ApiResponse<User | undefined> = yield call(webshopAPI.authenticate, action.payload)
        console.log({ info: 'loginFlow', apiResponse })

        if (apiResponse.error) {
            yield put(
                accountActions.ShowNotification({
                    id: uuidv4(),
                    title: `Error`,
                    message: apiResponse.error,
                    type: NotificationType.Error,
                    dismissed: false,
                })
            )

            throw new Error(apiResponse.error)
        } else {
            if (apiResponse.data === undefined) throw new Error('Could not login. The returned data was undefined')
            const { id, username, email, accessToken, refreshToken } = apiResponse.data
            const authenticatedUser: User = {
                id,
                accessToken,
                refreshToken,
                email,
                username,
            }

            console.log({ authenticatedUser })

            yield put(authActions.LoginSuccess(authenticatedUser))

            window.location.href = '/shop'
        }
    } catch (error) {
        yield put(authActions.LoginError(error as string))
    }
}

// Watcher saga
export function* logoutSaga() {
    yield takeLatest(AuthActionTypes.Logout, logoutFlow)
}

function* logoutFlow(action: Logout) {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    action.history.push('/login')
}

// Watcher saga
export function* getMyUserDataSaga() {
    yield takeLatest(AuthActionTypes.GetMyUserData, getMyUserDataFlow)
}

// Worker saga
function* getMyUserDataFlow(action: GetMyUserData) {
    try {
        // Call the API
        const apiResponse: ApiResponse<User | undefined> = yield call(webshopAPI.getMyUserData)
        console.log({ info: 'getMyUserDataFlow', apiResponse })

        if (apiResponse.error) {
            yield put(
                accountActions.ShowNotification({
                    id: uuidv4(),
                    title: `Error`,
                    message: apiResponse.error,
                    type: NotificationType.Error,
                    dismissed: false,
                })
            )

            throw new Error(apiResponse.error)
        } else {
            if (apiResponse.data === undefined) throw new Error('The returned data was undefined')

            const { id, username, email, accessToken, refreshToken } = apiResponse.data
            const authenticatedUser: User = {
                id,
                accessToken,
                refreshToken,
                email,
                username,
            }

            console.log({ authenticatedUser })

            yield put(authActions.GetMyUserDataSuccess(authenticatedUser))
            yield put(authActions.LoginSuccess(authenticatedUser))
        }
    } catch (error) {
        yield put(authActions.GetMyUserDataError(error as string))
    }
}
