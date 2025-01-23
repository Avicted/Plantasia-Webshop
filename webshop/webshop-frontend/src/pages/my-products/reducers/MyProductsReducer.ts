import produce from 'immer'
import { ShopItem } from '../../../models/ShopItem'
import { MyProductsActions, MyProductsActionTypes } from '../actions/MyProductsActions'

// State definition
interface MyProductsState {
    forSale: ShopItem[]
    sold: ShopItem[]
    purchased: ShopItem[]

    forSaleTotalCount: number | null
    soldTotalCount: number | null
    purchasedTotalCount: number | null

    isLoadingForSale: boolean
    isLoadingSold: boolean
    isLoadingPurchased: boolean

    forSaleError: string
    soldError: string
    purchasedError: string

    forSaleNextPage: string | null
    soldNextPage: string | null
    purchasedNextPage: string | null

    showAddNewProductDialog: boolean
    showEditMyProductDialog: boolean
    showConfirmDeletionDialog: boolean

    itemToBeDeleted: ShopItem | undefined
    itemToBeUpdated: ShopItem | undefined
}

const initialState: MyProductsState = {
    forSale: [],
    sold: [],
    purchased: [],

    forSaleTotalCount: null,
    soldTotalCount: null,
    purchasedTotalCount: null,

    isLoadingForSale: false,
    isLoadingSold: false,
    isLoadingPurchased: false,

    forSaleError: '',
    soldError: '',
    purchasedError: '',

    forSaleNextPage: null,
    soldNextPage: null,
    purchasedNextPage: null,

    showAddNewProductDialog: false,
    showEditMyProductDialog: false,
    showConfirmDeletionDialog: false,

    itemToBeDeleted: undefined,
    itemToBeUpdated: undefined,
}

export function myProductsReducer(state: MyProductsState = initialState, action: MyProductsActions) {
    switch (action.type) {
        case MyProductsActionTypes.GetMyProductsForSale:
            return produce(state, (draft) => {
                draft.isLoadingForSale = true
                draft.forSaleError = ''
                draft.forSaleTotalCount = null
            })
        case MyProductsActionTypes.GetMyProductsForSaleSuccess:
            return produce(state, (draft) => {
                const { count, next, previous, results } = action.response.data
                draft.isLoadingForSale = false
                draft.forSaleTotalCount = count

                if (!previous) {
                    draft.forSale = results
                } else {
                    // Do not push duplicates
                    results.map((item, index) => {
                        if (draft.forSale.findIndex((x) => x.id === item.id) === -1) {
                            draft.forSale.push(item)
                        }
                    })
                }

                draft.forSaleNextPage = next
            })
        case MyProductsActionTypes.GetMyProductsForSaleError:
            return produce(state, (draft) => {
                draft.isLoadingForSale = false
                draft.forSaleError = action.error
                draft.forSaleTotalCount = null
            })
        case MyProductsActionTypes.GetMySoldProducts:
            return produce(state, (draft) => {
                draft.isLoadingSold = true
                draft.soldError = ''
                draft.soldTotalCount = null
            })
        case MyProductsActionTypes.GetMySoldProductsSuccess:
            return produce(state, (draft) => {
                draft.isLoadingSold = false

                const { results, next, previous, count } = action.response.data

                if (!previous) {
                    draft.sold = results
                } else {
                    // Do not push duplicates
                    action.response.data.results.map((item, index) => {
                        if (draft.sold.findIndex((x) => x.id === item.id) === -1) {
                            draft.sold.push(item)
                        }
                    })
                }

                draft.soldTotalCount = action.response.data.count
            })
        case MyProductsActionTypes.GetMySoldProductsError:
            return produce(state, (draft) => {
                draft.isLoadingSold = false
                draft.soldError = action.error
                draft.soldTotalCount = null
            })
        case MyProductsActionTypes.GetMyPurchasedProducts:
            return produce(state, (draft) => {
                draft.isLoadingPurchased = true
                draft.purchasedTotalCount = null
            })
        case MyProductsActionTypes.GetMyPurchasedProductsSuccess:
            return produce(state, (draft) => {
                draft.isLoadingPurchased = false

                const { results, next, previous, count } = action.response.data

                if (!previous) {
                    draft.purchased = results
                } else {
                    // Do not push duplicates
                    action.response.data.results.map((item, index) => {
                        if (draft.purchased.findIndex((x) => x.id === item.id) === -1) {
                            draft.purchased.push(item)
                        }
                    })
                }

                draft.purchasedTotalCount = action.response.data.count
            })
        case MyProductsActionTypes.GetMyPurchasedProductsError:
            return produce(state, (draft) => {
                draft.isLoadingPurchased = false
                draft.purchasedError = action.error
                draft.purchasedTotalCount = null
            })
        case MyProductsActionTypes.ShowAddNewProductDialog:
            return produce(state, (draft) => {
                draft.showAddNewProductDialog = true
            })
        case MyProductsActionTypes.HideAddNewProductDialog:
            return produce(state, (draft) => {
                draft.showAddNewProductDialog = false
            })
        case MyProductsActionTypes.ShowEditMyProductDialog:
            return produce(state, (draft) => {
                draft.showEditMyProductDialog = true
                draft.itemToBeUpdated = action.product
            })
        case MyProductsActionTypes.HideEditMyProductDialog:
            return produce(state, (draft) => {
                draft.showEditMyProductDialog = false
                draft.itemToBeUpdated = undefined
            })
        case MyProductsActionTypes.ShowConfirmDeletionDialog:
            return produce(state, (draft) => {
                draft.showConfirmDeletionDialog = true
                draft.itemToBeDeleted = action.item
            })
        case MyProductsActionTypes.HideConfirmDeletionDialog:
            return produce(state, (draft) => {
                draft.showConfirmDeletionDialog = false
                draft.itemToBeDeleted = undefined
            })

        default:
            return state
    }
}
