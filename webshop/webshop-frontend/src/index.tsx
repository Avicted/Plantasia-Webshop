import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { SignupPage } from './pages/signup/SignupPage'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ShopPage } from './pages/shop/ShopPage'
import { LoginPage } from './pages/login/LoginPage'
import { Provider } from 'react-redux'
import store, { persistStore } from './framework/store'
import { AccountPage } from './pages/account/AccountPage'
import { MyProductsPage } from './pages/my-products/MyProductsPage'
import { NotFoundPage } from './shared/components/404'
import { PersistGate } from 'redux-persist/integration/react'

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <App>
                    <Switch>
                        <Route exact path="/signup">
                            <SignupPage />
                        </Route>
                        <Route exact path="/login">
                            <LoginPage />
                        </Route>
                        <Route exact path="/account">
                            <AccountPage />
                        </Route>
                        <Route exact path="/shop">
                            <ShopPage />
                        </Route>
                        <Route exact path="/myitems">
                            <MyProductsPage />
                        </Route>

                        {/* Fallback for when a route is not found */}
                        <NotFoundPage />
                    </Switch>
                </App>
            </Router>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
