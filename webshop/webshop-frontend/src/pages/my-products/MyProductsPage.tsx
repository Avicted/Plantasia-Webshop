import { UserCircleIcon, ClipboardListIcon, CurrencyEuroIcon } from '@heroicons/react/solid'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../framework/store/rootReducer'
import { ShopItem } from '../../models/ShopItem'
import { ShopItemIntent } from '../../models/ShopItemIntent'
import { SideNavigationItem } from '../../models/SideNavigationItem'
import { CreateShopItemDialog } from '../../shared/components/CreateShopItemDialog'
import { ShopItemCard } from '../../shared/components/ShopItemCard'
import { ShopItemDetailsDialog } from '../../shared/components/ShopItemDetailsDialog'
import { UpdateShopItemDialog } from '../../shared/components/UpdateShopItemDialog'
import { SideNavigation } from '../account/components/AccountSideNavigation'
import { myProductsActions } from './actions/MyProductsActions'

const navigation: SideNavigationItem[] = [
    { id: '0', name: 'My Items For Sale', link: '#', icon: UserCircleIcon },
    { id: '1', name: 'My Sold Items', link: '#', icon: CurrencyEuroIcon },
    { id: '2', name: 'My Purchased Items', link: '#', icon: ClipboardListIcon },
]

interface MyProductsPageProps {}

export const MyProductsPage: React.FunctionComponent<MyProductsPageProps> = ({ children }) => {
    const dispatch = useDispatch()

    const forSale: ShopItem[] = useSelector((state: AppState) => state.myProducts.forSale)
    const purchased: ShopItem[] = useSelector((state: AppState) => state.myProducts.purchased)
    const sold: ShopItem[] = useSelector((state: AppState) => state.myProducts.sold)

    const forSaleTotalCount: number | null = useSelector((state: AppState) => state.myProducts.forSaleTotalCount)
    const purchasedTotalCount: number | null = useSelector((state: AppState) => state.myProducts.purchasedTotalCount)
    const soldTotalCount: number | null = useSelector((state: AppState) => state.myProducts.soldTotalCount)

    const isLoadingForSale: boolean = useSelector((state: AppState) => state.myProducts.isLoadingForSale)
    const isLoadingMySold: boolean = useSelector((state: AppState) => state.myProducts.isLoadingSold)
    const isLoadingMyPurchased: boolean = useSelector((state: AppState) => state.myProducts.isLoadingPurchased)

    const productDetails: ShopItem | undefined = useSelector((state: AppState) => state.shop.productDetails)

    const forSaleNextPage: string | null = useSelector((state: AppState) => state.myProducts.forSaleNextPage)
    const soldNextPage: string | null = useSelector((state: AppState) => state.myProducts.soldNextPage)
    const purchasedNextPage: string | null = useSelector((state: AppState) => state.myProducts.purchasedNextPage)

    const [activeIndex, setActiveIndex] = useState<string>(navigation[0].id)

    // Once the component mounts, fetch all products from the backend
    useEffect(() => {
        dispatch(myProductsActions.GetMyProductsForSale(forSaleNextPage))
        dispatch(myProductsActions.GetMySoldProducts(soldNextPage))
        dispatch(myProductsActions.GetMyPurchasedProducts(purchasedNextPage))
    }, [activeIndex])

    useEffect(() => {}, [forSaleTotalCount, purchasedTotalCount, soldTotalCount])

    const selectSubmenuItem = (item: SideNavigationItem): void => {
        setActiveIndex(navigation.filter((navItem) => navItem.id === item.id)[0].id)
    }

    const renderProducts = (products: ShopItem[], intent: ShopItemIntent): JSX.Element => {
        const getLoaderValue = (intent: ShopItemIntent): boolean => {
            switch (intent) {
                case ShopItemIntent.MyProductForSale:
                    return isLoadingForSale
                case ShopItemIntent.MySoldProduct:
                    return isLoadingMySold
                case ShopItemIntent.MyPurchasedProduct:
                    return isLoadingMyPurchased
                default:
                    return false
            }
        }

        return (
            <div className="flex flex-col">
                <div className="flex mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {!products ? (
                        <p className="font-small text-2xl text-pink-300">You have no items for sale</p>
                    ) : (
                        <>
                            {getLoaderValue(intent) ? (
                                <>Loading products...</>
                            ) : (
                                <>
                                    {products.map((product, index) => {
                                        return <ShopItemCard key={index} product={product} intent={intent} />
                                    })}
                                </>
                            )}
                        </>
                    )}
                </div>
                {forSaleNextPage !== null && (
                    <div className="my-10 flex flex-row justify-center mt-32">
                        <button
                            onClick={() => dispatch(myProductsActions.GetMyProductsForSale(forSaleNextPage))}
                            type="button"
                            className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                            View more
                        </button>
                    </div>
                )}
            </div>
        )
    }

    const renderProductCount = (intent: ShopItemIntent): string => {
        let productCount: number | null = null
        let totalCount: number | null = null

        if (intent === ShopItemIntent.MyProductForSale) {
            productCount = forSale.length
            totalCount = forSaleTotalCount
        } else if (intent === ShopItemIntent.MySoldProduct) {
            productCount = sold.length
            totalCount = soldTotalCount
        } else if (intent === ShopItemIntent.MyPurchasedProduct) {
            productCount = purchased.length
            totalCount = purchasedTotalCount
        }

        if (productCount === null || totalCount === null) return ''

        return `Displaying ${productCount} out of ${totalCount} products`
    }

    return (
        <>
            <CreateShopItemDialog />

            <UpdateShopItemDialog />

            <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
                <SideNavigation
                    navigation={navigation}
                    activeIndex={parseInt(activeIndex)}
                    selectSubmenuItem={selectSubmenuItem}
                />

                <div className="space-y-6 lg:col-span-9 sm:rounded-lg rounded-md pl-6 pr-6 pt-4">
                    <div className="mb-16">
                        <div className="pb-5">
                            <h3 className="inline-flex text-lg leading-6 font-medium text-gray-900">
                                {navigation[parseInt(activeIndex)].name}
                            </h3>

                            {activeIndex === '0' && (
                                <button
                                    onClick={() => dispatch(myProductsActions.ShowAddNewProductDialog())}
                                    type="button"
                                    className="ml-8 inline-flex items-center px-3.5 py-2 border border-transparent text-sm leading-4 font-medium rounded-full shadow-sm text-white bg-green-500 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Add item
                                </button>
                            )}

                            <p className="mt-2 max-w-4xl text-sm text-pink-600 font-display">
                                {activeIndex === '0' && renderProductCount(ShopItemIntent.MyProductForSale)}

                                {activeIndex === '1' && renderProductCount(ShopItemIntent.MySoldProduct)}

                                {activeIndex === '2' && renderProductCount(ShopItemIntent.MyPurchasedProduct)}
                            </p>
                        </div>

                        {activeIndex === '0' && (
                            <>
                                <ShopItemDetailsDialog
                                    product={productDetails}
                                    intent={ShopItemIntent.MyProductForSale}
                                />

                                <div
                                    className={`mt-2 flex items-center justify-center align-middle ${
                                        forSale.length > 0 ? 'border-0' : 'border-4 h-48'
                                    } border-pink-300 border-dashed rounded-md`}
                                >
                                    {forSale.length > 0 ? (
                                        <>{renderProducts(forSale, ShopItemIntent.MyProductForSale)}</>
                                    ) : (
                                        <p className="font-mono flex text-pink-600 text-2xl font-bold">
                                            You have not listed any items for sale
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {activeIndex === '1' && (
                            <>
                                <ShopItemDetailsDialog
                                    product={productDetails}
                                    intent={ShopItemIntent.MyPurchasedProduct}
                                />

                                <div
                                    className={`mt-2 flex items-center justify-center align-middle ${
                                        sold.length > 0 ? 'border-0' : 'border-4 h-48'
                                    } border-pink-300 border-dashed rounded-md`}
                                >
                                    {sold.length > 0 ? (
                                        <>{renderProducts(sold, ShopItemIntent.MySoldProduct)}</>
                                    ) : (
                                        <p className="font-mono flex text-pink-600 text-2xl font-bold">
                                            You have not sold any items
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {activeIndex === '2' && (
                            <>
                                <ShopItemDetailsDialog
                                    product={productDetails}
                                    intent={ShopItemIntent.MyPurchasedProduct}
                                />

                                <div
                                    className={`mt-2 flex items-center justify-center align-middle ${
                                        purchased.length > 0 ? 'border-0' : 'border-4 h-48'
                                    } border-pink-300 border-dashed rounded-md`}
                                >
                                    {purchased.length > 0 ? (
                                        <>{renderProducts(purchased, ShopItemIntent.MyPurchasedProduct)}</>
                                    ) : (
                                        <p className="font-mono flex text-pink-600 text-2xl font-bold">
                                            You have not purchased any items
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
