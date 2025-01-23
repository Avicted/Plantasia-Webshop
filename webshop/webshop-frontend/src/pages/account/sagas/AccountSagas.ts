import { call, put, takeEvery, takeLatest, takeLeading } from '@redux-saga/core/effects'
import { delay } from 'redux-saga/effects'
import { WebshopAPI } from '../../../api/WebshopAPI'
import { ApiResponse } from '../../../models/ApiResponse'
import { accountActions, AccountActionTypes, ChangePassword, ShowNotification } from '../actions/AccountActions'
import { v4 as uuidv4 } from 'uuid'
import { NotificationType } from '../../../models/NotificationData'

const webshopApi = new WebshopAPI()

// @Note(Victor): This is where all the buissness logic lives for the AccountPage

// Watcher saga
export function* ChangePasswordSaga() {
    yield takeLatest(AccountActionTypes.ChangePassword, ChangePasswordFlow)
}

// Worker saga
function* ChangePasswordFlow(action: ChangePassword) {
    try {
        const response: ApiResponse<undefined> = yield call(webshopApi.changePassword, action.requestData)
        console.log({ info: 'ChangePasswordFlow', response })

        if (response.error) {
            yield put(
                accountActions.ShowNotification({
                    id: uuidv4(),
                    title: `Error`,
                    message: response.error,
                    type: NotificationType.Error,
                    dismissed: false,
                })
            )
            throw new Error(response.error.toString())
        } else {
            yield put(accountActions.ChangePasswordError('Error: Could not change the password.'))
        }

        yield put(accountActions.ChangePasswordSuccess(response.message))

        yield put(
            accountActions.ShowNotification({
                id: uuidv4(),
                title: `Success`,
                message: response.message || 'Password successfully updated!',
                type: NotificationType.Success,
                dismissed: false,
            })
        )
    } catch (error) {
        yield put(accountActions.ChangePasswordError(error as string))
    }
}

// Watcher saga
export function* showNotificationSaga() {
    yield takeEvery(AccountActionTypes.ShowNotification, ShowNotificationFlow)
}

function* ShowNotificationFlow(action: ShowNotification) {
    const millisecondsToShow = action.data.timeToShowMilliSeconds ? action.data.timeToShowMilliSeconds : 5000
    yield delay(millisecondsToShow)

    yield put(accountActions.HideNotification(action.data.id))
}
