import { Transition, Dialog } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ShopItem } from '../../models/ShopItem'
import { shoppingCartActions } from '../../pages/shop/actions/ShoppingCartActions'
import { AppState } from '../store/rootReducer'
import { ConfirmPurchaseCompleteDialog } from './ConfirmPurchaseCompleteDialog'

interface ShoppingCartProps {}

export const ShoppingCart: React.FunctionComponent<ShoppingCartProps> = ({}) => {
    const open = useSelector((state: AppState) => state.shoppingCart.showShoppingCart)
    const shoppingCartItems = useSelector((state: AppState) => state.shoppingCart.productsInBasket)
    const dispatch = useDispatch()
    const userId: string | undefined = useSelector((state: AppState) => state.auth.user?.id)

    const calculateSubtotal = (): number => {
        let subtotal: number = 0

        for (let i: number = 0; i < shoppingCartItems.length; i++) {
            if (!shoppingCartItems[i]) continue
            subtotal += shoppingCartItems[i].price
        }

        return subtotal
    }

    const renderShoppingCartItems = (products: ShopItem[]): JSX.Element => {
        if (products.length > 0) {
            return (
                <div>
                    <ConfirmPurchaseCompleteDialog />

                    {shoppingCartItems.map((item) => (
                        <li key={item.id} className="py-6 flex">
                            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                <img
                                    src={item.image_src}
                                    alt={item.image_alt}
                                    className="w-full h-full object-center object-cover"
                                />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                                <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                            <a href={'#'}>{item.name}</a>
                                        </h3>
                                        <p className="ml-4">{item.price} €</p>
                                    </div>
                                    {item.buyer_id ? (
                                        <>
                                            {item.buyer_id === userId ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                                                    <div className="flex flex-col text-sm text-green-700 p-1">
                                                        <div className="flex flex-col">Item purchased!</div>
                                                    </div>
                                                </span>
                                            ) : (
                                                <>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800">
                                                        <div className="flex flex-col text-sm text-red-700 p-1">
                                                            <div className="flex flex-col">Item not available</div>
                                                        </div>
                                                    </span>

                                                    <div className="flex">
                                                        <button
                                                            onClick={() =>
                                                                dispatch(
                                                                    shoppingCartActions.RemoveFromShoppingCart(
                                                                        parseInt(item.id)
                                                                    )
                                                                )
                                                            }
                                                            type="button"
                                                            className="font-medium text-pink-600 hover:text-pink-500"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {item.oldPrice && item.inStock === undefined && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                                                    <div className="flex flex-col text-sm text-green-700 p-1">
                                                        <div className="flex flex-col">
                                                            The price has been updated from:
                                                        </div>
                                                        <div className="flex flex-row">
                                                            <span className="text-bold">
                                                                <b>{item.oldPrice} €</b> to <b>{item.newPrice} €</b>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </span>
                                            )}

                                            <div className="flex-1 flex items-end justify-between text-sm">
                                                {item.buyer_id !== null && item.buyer_id === userId ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                                                        <div className="flex flex-col text-sm text-green-700 p-1">
                                                            <div className="flex flex-col">Item purchased!</div>
                                                        </div>
                                                    </span>
                                                ) : (
                                                    <div className="flex">
                                                        <button
                                                            onClick={() =>
                                                                dispatch(
                                                                    shoppingCartActions.RemoveFromShoppingCart(
                                                                        parseInt(item.id)
                                                                    )
                                                                )
                                                            }
                                                            type="button"
                                                            className="font-medium text-pink-600 hover:text-pink-500"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </div>
            )
        } else {
            return <p className="font-mono text-2xl m-auto text-center">The shopping cart is empty</p>
        }
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-50 inset-0 overflow-hidden"
                onClose={() => dispatch(shoppingCartActions.HideShoppingCart())}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="absolute inset-0 bg-gradient-to-r from-white transition-opacity backdrop-filter backdrop-blur-lg" />
                    </Transition.Child>

                    <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-in-out duration-300"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in-out duration-300"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <div className="w-screen max-w-md">
                                <div className="h-full flex flex-col bg-white shadow-2xl overflow-y-scroll">
                                    <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                                        <div className="flex items-start justify-between">
                                            <Dialog.Title className="text-lg font-medium text-gray-900">
                                                Shopping cart
                                            </Dialog.Title>
                                            <div className="ml-3 h-7 flex items-center">
                                                <button
                                                    type="button"
                                                    className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                                    onClick={() => dispatch(shoppingCartActions.HideShoppingCart())}
                                                >
                                                    <span className="sr-only">Close panel</span>
                                                    <XIcon className="h-6 w-6" aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <div className="flow-root">
                                                <ul role="list" className="divide-gray-200">
                                                    {renderShoppingCartItems(shoppingCartItems)}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <p>Subtotal</p>
                                            <p>{calculateSubtotal()} €</p>
                                        </div>
                                        <p className="mt-0.5 text-sm text-gray-500">
                                            Shipping and taxes calculated at checkout.
                                        </p>
                                        <div className="mt-6">
                                            <button
                                                onClick={() => {
                                                    if (shoppingCartItems.length <= 0) return
                                                    dispatch(shoppingCartActions.Checkout(shoppingCartItems))
                                                }}
                                                disabled={shoppingCartItems.length <= 0}
                                                className={`${
                                                    shoppingCartItems.length <= 0
                                                        ? 'bg-pink-600 opacity-50 hover:bg-pink-600 cursor-default'
                                                        : 'bg-pink-600 opacity-100 hover:bg-pink-700'
                                                } flex w-full justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white`}
                                            >
                                                Checkout
                                            </button>
                                        </div>
                                        <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                                            <p>
                                                or{' '}
                                                <button
                                                    type="button"
                                                    className="text-pink-600 font-medium hover:text-pink-500"
                                                    onClick={() => dispatch(shoppingCartActions.HideShoppingCart())}
                                                >
                                                    Continue Shopping<span aria-hidden="true"> &rarr;</span>
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
