import produce from 'immer'
import store from '../../../framework/store'
import { ShopItem } from '../../../models/ShopItem'
import { ShopActions, ShopActionTypes } from '../actions/ShopActions'

// State definition
interface ShopState {
    products: ShopItem[]
    nextPage: string | null
    totalCount: number | null
    isLoadingProducts: boolean
    error: string
    showProductDetailsDialog: boolean
    productDetails: ShopItem | undefined

    searchResult: ShopItem[]
    searchResultNextPage: string | null
    searchResultCount: number | null
    searchWord: string | undefined
}

const initialState: ShopState = {
    products: [],
    nextPage: null,
    totalCount: null,
    isLoadingProducts: false,
    error: '',
    showProductDetailsDialog: false,
    productDetails: undefined,

    searchResult: [],
    searchResultNextPage: null,
    searchResultCount: null,
    searchWord: undefined,
}

export function shopReducer(state: ShopState = initialState, action: ShopActions) {
    switch (action.type) {
        case ShopActionTypes.GetAllProducts:
            return produce(state, (draft) => {
                draft.isLoadingProducts = true
            })
        case ShopActionTypes.GetAllProductsSuccess:
            return produce(state, (draft) => {
                const { results, next, previous, count } = action.response.data

                if (!previous) {
                    draft.products = results
                } else {
                    // Do not push duplicates
                    action.response.data.results.map((item, index) => {
                        if (draft.products.findIndex((x) => x.id === item.id) === -1) {
                            draft.products.push(item)
                        }
                    })
                }

                draft.isLoadingProducts = false
                draft.nextPage = next
                draft.totalCount = count
            })
        case ShopActionTypes.GetAllProductsError:
            return produce(state, (draft) => {
                draft.error = action.error
                draft.isLoadingProducts = false
            })
        case ShopActionTypes.ShowProductDetails:
            return produce(state, (draft) => {
                draft.showProductDetailsDialog = true
                draft.productDetails = action.product
            })
        case ShopActionTypes.HideProductDetails:
            return produce(state, (draft) => {
                draft.showProductDetailsDialog = false
            })
        case ShopActionTypes.SearchByName:
            return produce(state, (draft) => {
                draft.searchWord = action.name
            })
        case ShopActionTypes.SearchByNameResult:
            return produce(state, (draft) => {
                const { results, next, previous, count } = action.result.data

                if (results.length <= 0) {
                    draft.searchResult = []
                } else {
                    if (!previous) {
                        draft.searchResult = results
                    } else {
                        // Do not push duplicates
                        action.result.data.results.map((item, index) => {
                            if (draft.searchResult.findIndex((x) => x.id === item.id) === -1) {
                                draft.searchResult.push(item)
                            }
                        })
                    }
                }

                draft.searchResultNextPage = action.result.data.next
                draft.searchResultCount = action.result.data.count
            })
        case ShopActionTypes.ResetSearch:
            return produce(state, (draft) => {
                draft.searchResult = []
                draft.searchResultNextPage = null
                draft.searchResultCount = null
                draft.searchWord = undefined
            })
        default:
            return state
    }
}
