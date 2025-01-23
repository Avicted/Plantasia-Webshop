import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../framework/store/rootReducer'
import { ShopItem } from '../../models/ShopItem'
import { ShopItemIntent } from '../../models/ShopItemIntent'
import { myProductsActions } from '../../pages/my-products/actions/MyProductsActions'
import { shopActions } from '../../pages/shop/actions/ShopActions'
import { AddToShoppingCartButton } from '../../pages/shop/components/AddToShoppingCartButton'
import { formatRelative } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { ConfirmDeletionDialog } from './ConfirmDeletionDialog'
const DEFAULT_IMAGE = require('../../assets/default_image.png')

interface ShopItemDetailsDialogProps {
    product: ShopItem | undefined
    intent: ShopItemIntent
}

export const ShopItemDetailsDialog: React.FunctionComponent<ShopItemDetailsDialogProps> = ({ product, intent }) => {
    const open = useSelector((state: AppState) => state.shop.showProductDetailsDialog)
    const dispatch = useDispatch()

    const canBePurchased = (intent: ShopItemIntent): boolean => {
        // When is the product not for sale?
        if (intent === ShopItemIntent.MyPurchasedProduct) return false
        if (intent === ShopItemIntent.MySoldProduct) return false
        if (intent === ShopItemIntent.MyProductForSale) return false
        if (intent === ShopItemIntent.ProductForSaleAnonymos) return false

        return true
    }

    const canBeDeleted = (intent: ShopItemIntent): boolean => {
        return intent === ShopItemIntent.MyProductForSale ? true : false
    }

    const canBeUpdated = (intent: ShopItemIntent): boolean => {
        return intent === ShopItemIntent.MyProductForSale ? true : false
    }

    return (
        <Transition show={open} as={Fragment}>
            <Dialog
                as="div"
                open={open}
                static
                onClose={() => dispatch(shopActions.HideProductDetails())}
                className="fixed inset-0 z-10 overflow-y-auto"
            >
                <ConfirmDeletionDialog />

                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gradient-to-t from-white transition-opacity backdrop-filter backdrop-blur-md" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-primary-dark shadow-2xl rounded-lg">
                            {product === undefined ? (
                                <>
                                    <Dialog.Title className="text-lg font-mono text-gray-700 font-bold">
                                        Error undefined product
                                    </Dialog.Title>

                                    <Dialog.Description className="mt-2">
                                        The product could not be found
                                    </Dialog.Description>

                                    <div className="flex flex-row mt-4">
                                        <div className="flex flex-grow justify-end">
                                            <button
                                                type="button"
                                                onClick={() => dispatch(shopActions.HideProductDetails())}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-300"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                                        <img
                                            src={product.image_src === null ? DEFAULT_IMAGE.default : product.image_src}
                                            alt={product.image_alt}
                                            className="w-full h-72 sm:w-full sm:max-w-50 sm:max-h-72 object-center object-cover group-hover:opacity-60"
                                            onError={(e: any) => {
                                                e.target.onerror = null
                                                e.target.src = DEFAULT_IMAGE.default
                                            }}
                                        />
                                    </div>

                                    <h1 className="sr-only">Shop item {product.name}</h1>
                                    <h3 className="mt-4 text-lg font-mono text-gray-700 font-bold group-hover:text-pink-600">
                                        {product.name}
                                    </h3>

                                    <p className="mt-2 mb-6 text-sm font-sans text-gray-600 group-hover:text-gray-400">
                                        {product.description}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Seller&nbsp;
                                        {product.seller.email}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Created&nbsp;
                                        {formatRelative(new Date(product.created_at), new Date(), {
                                            locale: enGB,
                                        })}
                                    </p>

                                    <div className="flex flex-row mt-4">
                                        <div className="flex justify-start">
                                            <p className="flex items-center  font-medium text-gray-900 group-hover:text-pink-600 font-mono">
                                                <b className=" text-2xl mr-1">{product.price}</b>
                                                <span className="text-lg flex inline-flexinline-flex select-none">
                                                    €
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex flex-grow justify-end">
                                            <button
                                                type="button"
                                                onClick={() => dispatch(shopActions.HideProductDetails())}
                                                className="mr-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-300"
                                            >
                                                Close
                                            </button>
                                            {canBeUpdated(intent) && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        dispatch(myProductsActions.ShowEditMyProductDialog(product))
                                                    }
                                                    className="mr-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-300"
                                                >
                                                    Edit Item
                                                </button>
                                            )}
                                            {canBeDeleted(intent) && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        dispatch(myProductsActions.ShowConfirmDeletionDialog(product))
                                                    }
                                                    className="mr-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-300"
                                                >
                                                    Delete Item
                                                </button>
                                            )}
                                            {canBePurchased(intent) && <AddToShoppingCartButton product={product} />}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}
