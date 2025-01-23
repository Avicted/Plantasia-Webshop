// import { WebshopAPI } from '../../../api/WebshopAPI'
import { call, put, takeLatest } from 'redux-saga/effects'
import { WebshopAPI } from '../../../api/WebshopAPI'
import { ApiResponse } from '../../../models/ApiResponse'
import { CheckoutErrorResponse } from '../../../models/CheckoutErrorResponse'
import { CheckoutRequest } from '../../../models/CheckoutRequest'
import { accountActions } from '../../account/actions/AccountActions'
import { Checkout, shoppingCartActions, ShoppingCartActionTypes } from '../actions/ShoppingCartActions'
import { v4 as uuidv4 } from 'uuid'
import { NotificationType } from '../../../models/NotificationData'
import { shopActions } from '../actions/ShopActions'

const webshopAPI = new WebshopAPI()

// @Note(Victor): This is where all the buissness logic lives for the ShoppingCart React component

// Watcher saga
export function* checkoutSaga() {
    yield takeLatest(ShoppingCartActionTypes.Checkout, checkoutFlow)
}

function* checkoutFlow(action: Checkout) {
    /* There are two different errors that can occur when the user tries to buy the
     * items in the shopping cart.
     *
     * 1. The item has been deleted by the seller / The item has been purchased my someone else
     *      - An error dialog should be displayed
     *      - Mark the item in the basket, let the user remove it manually
     *
     * 2. The price of has been edited by the seller
     *      - An info dialog should be displayed
     *      - The item should be automatically updated in the basket
     *          - With some indication that the price has been updated
     */
    try {
        // We only send the price field to check whether it has changed
        // we could send the whole ShopItem[] array with all the ShopItem fields
        const payload: CheckoutRequest = {
            items: action.items.map((item) => {
                return { id: item.id, price: item.price }
            }),
        }

        const res: ApiResponse<any> | CheckoutErrorResponse = yield call(webshopAPI.checkout, payload)
        console.log({ info: 'checkoutFlow', res })

        if (res.error) {
            const data = res as CheckoutErrorResponse

            // Update all the items in the shopping basket
            for (let i = 0; i < data.items_no_longer_available.length; i++) {
                const id = data.items_no_longer_available[i].id

                const itemDetailsRes: ApiResponse<any | undefined> = yield call(webshopAPI.getSingleProduct, id)

                if (itemDetailsRes.error) {
                    throw new Error(itemDetailsRes.error)
                } else {
                    yield put(shoppingCartActions.UpdateItem(itemDetailsRes.data))
                }
            }

            // Update all the items in the shopping basket
            for (let i = 0; i < data.items_with_price_updates.length; i++) {
                const id = data.items_with_price_updates[i].id

                const itemDetailsRes: ApiResponse<any | undefined> = yield call(webshopAPI.getSingleProduct, id)

                if (itemDetailsRes.error) {
                    throw new Error(itemDetailsRes.error)
                } else {
                    yield put(shoppingCartActions.UpdateItem(itemDetailsRes.data))
                }
            }

            // dispatch an action on the items in the shopping cart, to add various flags to them
            // e.g. not_available: boolean, price_changed...
            yield put(shoppingCartActions.CheckoutError(res as CheckoutErrorResponse))

            throw new Error(res.error)
        } else {
            yield put(shoppingCartActions.CheckoutSuccess())

            // Update all the items in the shop
            const data = res as ApiResponse<any>
            for (let i = 0; i < data.data.length; i++) {
                const id = data.data[i].id

                const itemDetailsRes: ApiResponse<any | undefined> = yield call(webshopAPI.getSingleProduct, id)

                if (itemDetailsRes.error) {
                    throw new Error(itemDetailsRes.error)
                } else {
                    yield put(shoppingCartActions.UpdateItem(itemDetailsRes.data))
                }
            }

            yield put(shoppingCartActions.ShowConfirmPurchaseCompleteDialog())
        }
    } catch (error) {
        /* if (res.code?.toString() !== '422') {
            yield put(
                accountActions.ShowNotification({
                    id: uuidv4(),
                    title: `Error!`,
                    message: `${error as string}`,
                    type: NotificationType.Error,
                    dismissed: false,
                    timeToShowMilliSeconds: 10000,
                })
            )
        } */
    } finally {
        yield put(shopActions.GetAllProducts(null))
    }
}
