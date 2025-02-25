import { createStore, applyMiddleware } from 'redux'
import rootReducer, { AppState } from './rootReducer'
import { compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { getAllProductsSaga, searchProductsSaga } from '../../pages/shop/sagas/ShopSagas'
import { checkoutSaga } from '../../pages/shop/sagas/ShoppingCartSagas'
import {
    getMyProductsForSaleSaga,
    getMySoldProductsSaga,
    getMyPurchasedProductsSaga,
    createItemSaga,
    deleteItemSaga,
    updateItemSaga,
} from '../../pages/my-products/sagas/MyProductsSagas'
import { registerNewUserSaga } from '../../pages/signup/sagas/SignupSagas'
import { getMyUserDataSaga, loginSaga, logoutSaga } from '../../pages/login/sagas/AuthSagas'
import { ChangePasswordSaga, showNotificationSaga } from '../../pages/account/sagas/AccountSagas'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
    }
}

const composeEnhancers =
    (process.env.NODE_ENV !== 'production' &&
        typeof window !== 'undefined' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

// configure middlewares
const middlewares = [sagaMiddleware]

// compose enhancers
const enhancer = composeEnhancers(applyMiddleware(...middlewares))

export const persistStore = {
    key: 'root',
    storage: storage,
}

const persistedReducer = persistReducer<AppState>(persistStore, rootReducer)

// rehydrate state on app start
const initialState = {}

// create store
const store = createStore(persistedReducer, initialState, enhancer)

// @Note(Victor): Remember to manually register new watcher sagas here
// @Note(Victor): Normally.. This would be automated by generating:
//  - Actions, reducers and sagas when a new component is created in the app.
//    a side effect of this code generation, would be the inclusion and sagaMiddleware.run

// Run sagas
sagaMiddleware.run(getAllProductsSaga)
sagaMiddleware.run(checkoutSaga)
sagaMiddleware.run(getMyProductsForSaleSaga)
sagaMiddleware.run(getMySoldProductsSaga)
sagaMiddleware.run(getMyPurchasedProductsSaga)
sagaMiddleware.run(registerNewUserSaga)
sagaMiddleware.run(loginSaga)
sagaMiddleware.run(logoutSaga)
sagaMiddleware.run(ChangePasswordSaga)
sagaMiddleware.run(getMyUserDataSaga)
sagaMiddleware.run(showNotificationSaga)
sagaMiddleware.run(createItemSaga)
sagaMiddleware.run(deleteItemSaga)
sagaMiddleware.run(updateItemSaga)
sagaMiddleware.run(searchProductsSaga)

// export store singleton instance
export default store
