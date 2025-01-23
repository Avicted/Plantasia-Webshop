import { WebshopAPI } from '../../../api/WebshopAPI'
import { GetAllProducts, SearchByName, shopActions, ShopActionTypes } from '../actions/ShopActions'
import { call, delay, put, takeLatest } from 'redux-saga/effects'
import { ApiPaginatedResponse, ApiResponse } from '../../../models/ApiResponse'
import { shoppingCartActions } from '../actions/ShoppingCartActions'
import { v4 as uuidv4 } from 'uuid'
import { accountActions } from '../../account/actions/AccountActions'
import { NotificationType } from '../../../models/NotificationData'

// @Note(Victor): This is where all the buissness logic lives for the ShopPage React component

const webshopAPI = new WebshopAPI()

// Watcher saga
export function* getAllProductsSaga() {
    yield takeLatest(ShopActionTypes.GetAllProducts, getAllProductsFlow)
}

function* getAllProductsFlow(action: GetAllProducts) {
    try {
        // Fetch the products from the API
        const { nextPage } = action

        const response: ApiResponse<ApiPaginatedResponse> = yield call(webshopAPI.getAllProducts, nextPage)
        console.log({ response })

        if (response.error) {
            alert(response)
            throw new Error(response.error)
        } else {
            // Check if we received any product data?
            if (response.data.results.length <= 0) throw new Error('No products found.')

            // Yield a new action "GetAllProductsSuccess" with the payload of "data"
            yield put(shopActions.GetAllProductsSuccess(response))
        }
    } catch (error) {
        yield put(shopActions.GetAllProductsError(error as string))
    }
}

// Wacther saga
export function* searchProductsSaga() {
    yield takeLatest(ShopActionTypes.SearchByName, searchProductsFlow)
}

// Worker saga
function* searchProductsFlow(action: SearchByName) {
    // debounce milliseconds
    yield delay(500)

    try {
        const { name, nextPage } = action
        const response: ApiResponse<ApiPaginatedResponse | undefined> = yield call(
            webshopAPI.searchProductsByName,
            name,
            nextPage
        )

        console.log({ info: 'searchProductsFlow', response })

        if (response === undefined || response.error) {
            throw new Error(response.error)
        } else {
            yield put(shopActions.SearchByNameResult(response as ApiResponse<ApiPaginatedResponse>))

            // Navigate to the Shop Page, of not already there
            if (action.history.location.pathname !== '/shop') {
                action.history.push('/shop')
            }
        }
    } catch (error) {
        yield put(
            accountActions.ShowNotification({
                id: uuidv4(),
                title: `Error`,
                message: `${error as string}`,
                type: NotificationType.Error,
                dismissed: false,
            })
        )
    }
}
