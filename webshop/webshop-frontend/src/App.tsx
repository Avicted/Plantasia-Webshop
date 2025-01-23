import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { Navbar } from './framework/components/Navbar'
import { ShoppingCart } from './framework/components/ShoppingCart'
import { AppState } from './framework/store/rootReducer'
import { authActions } from './pages/login/actions/AuthActions'
import { isAuthenticated } from './pages/login/reducers/AuthReducer'
import { Notification } from './framework/components/Notification'

const COVER_BG = require('./assets/cover_background.jpg')

interface AppProps {}

export const App: React.FunctionComponent<AppProps> = ({ children }) => {
    const dispatch = useDispatch()
    const isLoggedIn: boolean = useSelector((state: AppState) => isAuthenticated(state))

    // When the web app launches, if a access token exists in the local storage
    // Try to request the users data
    useEffect(() => {
        if (isLoggedIn) {
            dispatch(authActions.GetMyUserData())
        }
    }, [dispatch])

    return (
        <>
            <div className="">
                <Navbar />

                <Notification />

                <ShoppingCart />

                <div className="max-w-7xl mx-auto mb-32">
                    <div className="mt-8 px-4 sm:px-6 lg:px-8">{children}</div>
                </div>

                <div className="fixed top-0 -z-10 w-auto min-w-full min-h-full max-w-none bg-cover-background animated bg-cover h-screen bg-no-repeat bg-center"></div>
            </div>
        </>
    )
}
