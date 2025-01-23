import { combineReducers } from 'redux'
import { accountReducer } from '../../pages/account/reducers/AccountReducer'
import { authReducer } from '../../pages/login/reducers/AuthReducer'
import { myProductsReducer } from '../../pages/my-products/reducers/MyProductsReducer'
import { shoppingCartReducer } from '../../pages/shop/reducers/ShoppingCartReducer'
import { shopReducer } from '../../pages/shop/reducers/ShopReducer'
import { signupReducer } from '../../pages/signup/reducers/SignupReducer'

const rootReducer = combineReducers({
    shop: shopReducer,
    shoppingCart: shoppingCartReducer,
    myProducts: myProductsReducer,
    signup: signupReducer,
    auth: authReducer,
    account: accountReducer,
})

export type AppState = ReturnType<typeof rootReducer>

export default rootReducer
