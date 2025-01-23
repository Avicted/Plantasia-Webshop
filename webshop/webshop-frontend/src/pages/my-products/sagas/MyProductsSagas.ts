import { call, put, takeLatest } from '@redux-saga/core/effects'
import { WebshopAPI } from '../../../api/WebshopAPI'
import { ApiPaginatedResponse, ApiResponse } from '../../../models/ApiResponse'
import { ShopItem } from '../../../models/ShopItem'
import { accountActions } from '../../account/actions/AccountActions'
import {
    GetMyPurchasedProducts,
    GetMyProductsForSale,
    GetMySoldProducts,
    myProductsActions,
    MyProductsActionTypes,
    CreateItem,
    DeleteItem,
    UpdateItem,
} from '../actions/MyProductsActions'
import { v4 as uuidv4 } from 'uuid'
import { NotificationType } from '../../../models/NotificationData'
import { shopActions } from '../../shop/actions/ShopActions'

const webshopAPI = new WebshopAPI()

// Watcher saga
export function* getMyProductsForSaleSaga() {
    yield takeLatest(MyProductsActionTypes.GetMyProductsForSale, getMyProductsForSaleFlow)
}

// Worker saga
function* getMyProductsForSaleFlow(action: GetMyProductsForSale) {
    try {
        // Fetch the products from the API
        const myProductsForSale: ApiResponse<ApiPaginatedResponse> = yield call(
            webshopAPI.getMyProductsForSale,
            action.nextPage
        )
        console.log({
            myProductsForSale,
        })

        if (myProductsForSale.error) {
            // alert(myProductsForSale.error)
            throw new Error(myProductsForSale.error.toString())
        } else {
            // Check if we received any product data?
            if (myProductsForSale === undefined) throw new Error('The myProductsForSale data is undefined')

            // Yield a new action "GetMyProductsForSaleSuccess" with the payload of "myProductsForSale"
            console.log('=============================================================')
            console.log(myProductsForSale)
            console.log(myProductsForSale.data.results)
            yield put(myProductsActions.GetMyProductsForSaleSuccess(myProductsForSale))
        }
    } catch (error) {
        yield put(myProductsActions.GetMyProductsForSaleError(error as string))
    }
}

// Watcher saga
export function* getMySoldProductsSaga() {
    yield takeLatest(MyProductsActionTypes.GetMySoldProducts, getMySoldProductsFlow)
}

// Worker saga
function* getMySoldProductsFlow(action: GetMySoldProducts) {
    try {
        const mySoldProducts: ApiResponse<ApiPaginatedResponse> = yield call(
            webshopAPI.getMySoldProducts,
            action.nextPage
        )
        console.log({
            mySoldProducts,
        })

        if (mySoldProducts.error) {
            // (mySoldProducts.error)
            throw new Error(mySoldProducts.error.toString())
        } else {
            if (mySoldProducts === undefined) throw new Error('The mySoldProducts data is undefined')

            yield put(myProductsActions.GetMySoldProductsSuccess(mySoldProducts))
        }
    } catch (error) {
        yield put(myProductsActions.GetMySoldProductsError(error as string))
    }
}

// Watcher saga
export function* getMyPurchasedProductsSaga() {
    yield takeLatest(MyProductsActionTypes.GetMyPurchasedProducts, getMyPurchasedProductsFlow)
}

// Worker saga
function* getMyPurchasedProductsFlow(action: GetMyPurchasedProducts) {
    try {
        // Fetch the products from the API
        const myPurchasedProducts: ApiResponse<ApiPaginatedResponse> = yield call(
            webshopAPI.getMyPurchasedProducts,
            action.nextPage
        )
        console.log({
            myPurchasedProducts: myPurchasedProducts,
        })

        if (myPurchasedProducts.error) {
            // alert(myPurchasedProducts.error)
            throw new Error(myPurchasedProducts.error)
        } else {
            if (myPurchasedProducts === undefined) throw new Error('The myPurchasedProducts data is undefined')

            yield put(myProductsActions.GetMyPurchasedProductsSuccess(myPurchasedProducts))
        }
    } catch (error) {
        yield put(myProductsActions.GetMyPurchasedProductsError(error as string))
    }
}

// Watcher saga
export function* createItemSaga() {
    yield takeLatest(MyProductsActionTypes.CreateItem, createItemFlow)
}

// Worker saga
function* createItemFlow(action: CreateItem) {
    try {
        // Post the item data to the API, a successful response contains the create ShopItem
        const res: ApiResponse<ShopItem> = yield call(webshopAPI.createItem, action.item)
        console.log({ res })

        if (res.errors) {
            let errorResponse: Error = { name: '', message: '' }

            for (const [key, value] of Object.entries(res.errors)) {
                errorResponse.message += `${key}: ${value[0]}\n\n`
            }

            throw new Error(errorResponse.message)
        } else if (res.error) {
            throw new Error(res.error)
        } else {
            if (res === undefined) throw new Error('The createItemFlow res is undefined')

            // yay!
            yield put(myProductsActions.CreateItemSuccess())

            // Clear the UI
            yield put(myProductsActions.HideAddNewProductDialog())

            // Let's update the items we are selling
            yield put(myProductsActions.GetMyProductsForSale(null))

            yield put(
                accountActions.ShowNotification({
                    id: uuidv4(),
                    title: `Success! :)`,
                    message: `${res.message}`,
                    type: NotificationType.Success,
                    dismissed: false,
                })
            )
        }
    } catch (err: any) {
        const errorResponse: ApiResponse<unknown> = {
            error: err.message,
            data: [],
        }

        yield put(myProductsActions.CreateItemError(errorResponse.error as string))

        yield put(myProductsActions.HideAddNewProductDialog())

        yield put(
            accountActions.ShowNotification({
                id: uuidv4(),
                title: `Error :(`,
                message: errorResponse.error as string,
                type: NotificationType.Error,
                dismissed: false,
                timeToShowMilliSeconds: 10000,
            })
        )
    }
}

// Watcher saga
export function* updateItemSaga() {
    yield takeLatest(MyProductsActionTypes.UpdateItem, updateItemFlow)
}

// Worker saga
function* updateItemFlow(action: UpdateItem) {
    try {
        // Post the new item price to the API
        const res: ApiResponse<any> = yield call(webshopAPI.updateItem, action.item)
        console.log({ res })

        if (res.errors) {
            let errorResponse: Error = { name: '', message: '' }

            for (const [key, value] of Object.entries(res.errors)) {
                errorResponse.message += `${key}: ${value[0]}\n\n`
            }

            throw new Error(errorResponse.message)
        } else if (res.error) {
            throw new Error(res.error)
        } else {
            if (res === undefined) throw new Error('The updateItemFlow res is undefined')

            // yay!
            yield put(myProductsActions.UpdateItemSuccess())

            // Clear the UI
            yield put(myProductsActions.HideEditMyProductDialog())

            // Let's update the items we are selling
            yield put(myProductsActions.GetMyProductsForSale(null))

            yield put(
                accountActions.ShowNotification({
                    id: uuidv4(),
                    title: `Success! :)`,
                    message: `${res.message}`,
                    type: NotificationType.Success,
                    dismissed: false,
                })
            )
        }
    } catch (err: any) {
        const errorResponse: ApiResponse<unknown> = {
            error: err.message,
            data: [],
        }

        yield put(myProductsActions.UpdateItemError(errorResponse.error as string))

        yield put(myProductsActions.HideEditMyProductDialog())

        yield put(
            accountActions.ShowNotification({
                id: uuidv4(),
                title: `Error :(`,
                message: errorResponse.error as string,
                type: NotificationType.Error,
                dismissed: false,
                timeToShowMilliSeconds: 10000,
            })
        )
    }
}

// Watcher saga
export function* deleteItemSaga() {
    yield takeLatest(MyProductsActionTypes.DeleteItem, deleteItemFlow)
}

// Worker saga
function* deleteItemFlow(action: DeleteItem) {
    try {
        const res: ApiResponse<undefined> = yield call(webshopAPI.deleteItem, action.item.id)
        console.log({ res })

        if (res.error) {
            throw new Error(res.error)
        } else {
            if (res.data === undefined) throw new Error('The deleteItemFlow res is undefined')

            yield put(myProductsActions.DeleteItemSuccess(res.data))

            yield put(shopActions.HideProductDetails())

            yield put(myProductsActions.HideConfirmDeletionDialog())

            yield put(
                accountActions.ShowNotification({
                    id: uuidv4(),
                    title: `Deletion Successful`,
                    message: `The item ${action.item.name} was successfully deleted`,
                    type: NotificationType.Success,
                    dismissed: false,
                })
            )

            yield put(myProductsActions.GetMyProductsForSale(null))
        }
    } catch (error: any) {
        yield put(myProductsActions.DeleteItemError(error as string))

        yield put(myProductsActions.HideConfirmDeletionDialog())

        yield put(
            accountActions.ShowNotification({
                id: uuidv4(),
                title: `Error :(`,
                message: error.message as string,
                type: NotificationType.Error,
                dismissed: false,
                timeToShowMilliSeconds: 10000,
            })
        )
    }
}
