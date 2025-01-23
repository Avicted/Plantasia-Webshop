import { Disclosure } from '@headlessui/react'
import { SearchIcon } from '@heroicons/react/solid'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { useDispatch, useSelector } from 'react-redux'
import { shoppingCartActions } from '../../pages/shop/actions/ShoppingCartActions'
import { AppState } from '../store/rootReducer'
import { Link, NavLink, useHistory } from 'react-router-dom'
import { isAuthenticated } from '../../pages/login/reducers/AuthReducer'
import { User } from '../../models/User'
import { Dispatch } from 'redux'
import { authActions } from '../../pages/login/actions/AuthActions'
import { useEffect } from 'react'
import { shopActions } from '../../pages/shop/actions/ShopActions'

enum Position {
    Left,
    Right,
}

interface NavigationItem {
    name: string
    link: string
    position: Position
    submenu: boolean
    requiresAuth: boolean
    onClick: (...params: any) => void
}

const navigation: NavigationItem[] = [
    {
        name: 'Account settings',
        link: '/account',
        position: Position.Right,
        submenu: true,
        requiresAuth: true,
        onClick: () => {},
    },
    {
        name: 'Logout',
        link: '/login',
        position: Position.Right,
        submenu: true,
        requiresAuth: true,
        onClick: (dispatch: Dispatch<any>, history: any) => {
            dispatch(authActions.Logout(history))
        },
    },
    {
        name: 'My items',
        link: '/myitems',
        position: Position.Left,
        submenu: true,
        requiresAuth: true,
        onClick: () => {},
    },
    {
        name: 'Shop',
        link: '/shop',
        position: Position.Left,
        submenu: true,
        requiresAuth: false,
        onClick: () => {},
    },
    {
        name: 'Register',
        link: '/signup',
        position: Position.Right,
        submenu: false,
        requiresAuth: false,
        onClick: () => {},
    },
    {
        name: 'Login',
        link: '/login',
        position: Position.Right,
        submenu: false,
        requiresAuth: false,
        onClick: () => {},
    },
]

interface NavbarProps {}

export const Navbar: React.FunctionComponent<NavbarProps> = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const shoppingCartItems = useSelector((state: AppState) => state.shoppingCart.productsInBasket)
    const isLoggedIn: boolean = useSelector((state: AppState) => isAuthenticated(state))
    const user: User | undefined = useSelector((state: AppState) => state.auth.user)
    const nextPage: string | null = useSelector((state: AppState) => state.shop.nextPage)
    const searchResultNextPage = useSelector((state: AppState) => state.shop.searchResultNextPage)

    useEffect(() => {}, [isLoggedIn, user])

    const renderNavItem = (item: NavigationItem): JSX.Element | null => {
        if (item.requiresAuth ? (isLoggedIn ? true : false) : true) {
            return (
                <NavLink
                    className="flex px-4 py-2 text-base font-medium text-gray-500 hover:text-pink-600 hover:bg-gray-100"
                    onClick={() => item.onClick(dispatch, history)}
                    to={item.link}
                    activeClassName="bg-gray-100 text-gray-900 border-md"
                >
                    {item.name}
                </NavLink>
            )
        }
        return null
    }

    const renderNavigationSubmenu = (): JSX.Element | null => {
        return (
            <nav className="hidden lg:py-2 lg:flex" aria-label="Navigation sub-menu">
                {navigation
                    .filter((item) => item.position === Position.Left && item.submenu)
                    .map((item, index) => (
                        <div key={index}>{renderNavItem(item)}</div>
                    ))}
                <div className="flex-grow" />
                {navigation
                    .filter((item) => item.position === Position.Right && item.submenu)
                    .map((item, index) => (
                        <div key={index}>{renderNavItem(item)}</div>
                    ))}
            </nav>
        )
    }

    const renderNavigationMenu = (open: boolean): JSX.Element => {
        return (
            <nav aria-label="Main navigation menu" className="flex">
                {isLoggedIn ? (
                    <div className="hidden lg:flex inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {renderShoppingCartButton()}
                        <div className="flex rounded-md py-2 px-3 inline-flex items-center text-sm font-medium text-pink-700">
                            {user?.username}
                        </div>
                    </div>
                ) : (
                    <div className="hidden lg:flex flex-row flex inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {navigation
                            .filter((item) => !item.submenu)
                            .map((item, index) => (
                                /* @Note(Victor): z-10 hack  */
                                <div className="z-10" key={index}>
                                    {renderNavItem(item)}
                                </div>
                            ))}
                    </div>
                )}

                <div className="relative z-10 flex ml-4 lg:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500">
                        <span className="sr-only">Open menu</span>
                        {open ? (
                            <XIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                            <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                        )}
                    </Disclosure.Button>
                </div>
            </nav>
        )
    }

    const renderMobileMenu = (): JSX.Element | null => {
        return (
            <Disclosure.Panel as="nav" className="lg:hidden" aria-label="Global">
                {navigation.map((item, index) => {
                    if (item.requiresAuth ? (isLoggedIn ? true : false) : true) {
                        if (isLoggedIn && (item.name === 'Register' || item.name === 'Login')) return

                        return (
                            <div
                                onClick={() => {
                                    item.onClick(dispatch, history)
                                }}
                                key={index}
                            >
                                <Disclosure.Button
                                    as={NavLink}
                                    className="flex px-4 py-4 text-base font-medium text-gray-500 hover:text-pink-600 hover:bg-gray-100"
                                    to={item.link}
                                    activeClassName="bg-gray-100 text-gray-900 border-md"
                                >
                                    {item.name}
                                </Disclosure.Button>
                            </div>
                        )
                    }
                })}
            </Disclosure.Panel>
        )
    }

    const renderShoppingCartButton = (): JSX.Element => (
        <button
            onClick={() => dispatch(shoppingCartActions.ShowShoppingCart())}
            className="flex sm:relative ml-auto flex-shrink-0 lg:mr-4 group m-2 p-1 pr-6 items-center bg-white text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
            <span className="sr-only">View items in shopping cart</span>
            {/* <ShoppingBagIcon
                className="flex-shrink-0 h-6 w-6 text-gray-500 group-hover:text-pink-700"
                aria-hidden="true"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span> */}
            <span className="relative">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0 h-6 w-6 text-gray-500 group-hover:text-pink-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>

                <span
                    className={`${
                        shoppingCartItems.length <= 0 ? 'hidden' : ' bg-pink-600'
                    } absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-full rounded-full`}
                >
                    {shoppingCartItems.length}
                </span>
            </span>
        </button>
    )

    return (
        <Disclosure as="nav" className="bg-white shadow">
            {({ open }) => (
                <>
                    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
                        <div className="relative h-16 flex justify-between">
                            <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">
                                <div className="flex-shrink-0 flex items-center">
                                    <Link
                                        to="/shop"
                                        /* @Note(Victor): z-10 hack  */
                                        className="z-10 hover:text-black hover:underline relative px-2 flex lg:px-0 flex-shrink-0 flex items-center text-2xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-500"
                                    >
                                        plantasia
                                    </Link>
                                </div>
                            </div>
                            <div className="flex flex-1 px-2 items-center justify-center sm:absolute sm:inset-0">
                                <div className="w-full sm:max-w-xs">
                                    <label htmlFor="search" className="sr-only">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <input
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                                if (e.target.value.length <= 0) {
                                                    dispatch(shopActions.ResetSearch())
                                                } else {
                                                    dispatch(
                                                        shopActions.SearchByName(
                                                            e.target.value,
                                                            searchResultNextPage,
                                                            history
                                                        )
                                                    )
                                                }
                                            }}
                                            id="search"
                                            name="search"
                                            className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                            placeholder="Search"
                                            type="search"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                            {renderNavigationMenu(open)}
                        </div>
                        {renderNavigationSubmenu()}
                    </div>

                    {renderMobileMenu()}

                    {isLoggedIn && (
                        <Disclosure.Panel className="lg:hidden">
                            <div className="pt-4 pb-3 border-t border-gray-200">
                                <div className="flex items-center px-4">
                                    <div>
                                        <div className="text-base font-medium text-gray-800">{user?.username}</div>
                                        <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                                    </div>

                                    {renderShoppingCartButton()}
                                </div>
                            </div>
                        </Disclosure.Panel>
                    )}
                </>
            )}
        </Disclosure>
    )
}
