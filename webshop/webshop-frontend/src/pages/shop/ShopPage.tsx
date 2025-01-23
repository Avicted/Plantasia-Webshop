import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { shopActions } from './actions/ShopActions'
import { AppState } from '../../framework/store/rootReducer'
import { ShopItem } from '../../models/ShopItem'
import { ShopItemDetailsDialog } from '../../shared/components/ShopItemDetailsDialog'
import { ShopItemIntent } from '../../models/ShopItemIntent'
import { isAuthenticated } from '../login/reducers/AuthReducer'
import { ShopItemCard } from '../../shared/components/ShopItemCard'
import { useHistory } from 'react-router-dom'

interface ShopPageProps {}

export const ShopPage: React.FunctionComponent<ShopPageProps> = ({ children }) => {
    const dispatch = useDispatch()
    const history = useHistory()

    const products: ShopItem[] = useSelector((state: AppState) => state.shop.products)

    const searchResult: ShopItem[] = useSelector((state: AppState) => state.shop.searchResult)
    const searchResultNextPage: string | null = useSelector((state: AppState) => state.shop.searchResultNextPage)
    const searchResultCount: number | null = useSelector((state: AppState) => state.shop.searchResultCount)
    const searchWord: string | undefined = useSelector((state: AppState) => state.shop.searchWord)

    const productDetails: ShopItem | undefined = useSelector((state: AppState) => state.shop.productDetails)
    const IS_LOGGED_IN: boolean = useSelector((state: AppState) => isAuthenticated(state))
    const nextPage: string | null = useSelector((state: AppState) => state.shop.nextPage)
    const totalCount: number | null = useSelector((state: AppState) => state.shop.totalCount)

    // Once the component mounts, fetch all products from the backend
    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {}, [IS_LOGGED_IN])

    const fetchProducts = (): void => {
        dispatch(shopActions.GetAllProducts(nextPage))
    }

    const fetchNextSearchResultPage = (): void => {
        if (searchWord) dispatch(shopActions.SearchByName(searchWord, searchResultNextPage, history))
    }

    return (
        <div>
            <ShopItemDetailsDialog
                product={productDetails}
                intent={
                    IS_LOGGED_IN ? ShopItemIntent.ProductForSaleAuthenticated : ShopItemIntent.ProductForSaleAnonymos
                }
            />

            {searchResult.length > 0 && searchWord !== undefined && searchWord.length > 0 ? (
                <div className="bg-whiteshadow-2xl sm:rounded-lg">
                    <div className="pb-5 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Shop | Search results</h3>
                        <p className="mt-2 max-w-4xl text-sm text-pink-800 font-display">
                            <>
                                {searchWord !== undefined &&
                                searchWord.length > 0 &&
                                searchResultCount !== null &&
                                searchResultCount > 0
                                    ? `Displaying ${searchResult.length} out of ${searchResultCount} search results`
                                    : `dawdawwdawdawd`}
                            </>
                        </p>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {searchResult.map((product, index) => {
                            return (
                                <ShopItemCard
                                    key={index}
                                    product={product}
                                    intent={
                                        IS_LOGGED_IN
                                            ? ShopItemIntent.ProductForSaleAuthenticated
                                            : ShopItemIntent.ProductForSaleAnonymos
                                    }
                                />
                            )
                        })}
                    </div>

                    {nextPage !== null && searchResult.length !== searchResultCount && (
                        <div className="my-10 flex flex-row justify-center mt-32">
                            <button
                                onClick={() => fetchNextSearchResultPage()}
                                type="button"
                                className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                                View more
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-whiteshadow-2xl sm:rounded-lg">
                    <div className="pb-5 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Shop</h3>
                        <p className="mt-2 max-w-4xl text-sm text-pink-800 font-display">
                            Displaying {products.length} out of {totalCount} products
                        </p>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {products.map((product, index) => {
                            return (
                                <ShopItemCard
                                    key={index}
                                    product={product}
                                    intent={
                                        IS_LOGGED_IN
                                            ? ShopItemIntent.ProductForSaleAuthenticated
                                            : ShopItemIntent.ProductForSaleAnonymos
                                    }
                                />
                            )
                        })}
                    </div>

                    {nextPage && (
                        <div className="my-10 flex flex-row justify-center mt-32">
                            <button
                                onClick={() => fetchProducts()}
                                type="button"
                                className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                                View more
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
