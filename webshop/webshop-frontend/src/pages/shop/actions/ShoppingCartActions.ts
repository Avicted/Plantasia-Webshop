import { Action } from 'redux'
import { CheckoutErrorResponse } from '../../../models/CheckoutErrorResponse'
import { ShopItem } from '../../../models/ShopItem'

export enum ShoppingCartActionTypes {
    AddToShoppingCart = 'ShoppingCart/AddToShoppingCart',
    RemoveFromShoppingCart = 'ShoppingCart/RemoveFromShoppingCart',
    ShowShoppingCart = 'ShoppingCart/ShowShoppingCart',
    HideShoppingCart = 'ShoppingCart/HideShoppingCart',
    Checkout = 'ShoppingCart/Checkout',
    CheckoutSuccess = 'ShoppingCart/CheckoutSuccess',
    CheckoutError = 'ShoppingCart/CheckoutError',
    UpdateItem = 'ShoppingCart/UpdateItem',

    ShowConfirmPurchaseCompleteDialog = 'ShoppingCart/ShowConfirmPurchaseCompleteDialog',
    HideConfirmPurchaseCompleteDialog = 'ShoppingCart/HideConfirmPurchaseCompleteDialog',
}

export interface AddToShoppingCart extends Action {
    type: ShoppingCartActionTypes.AddToShoppingCart
    product: ShopItem
}

export interface RemoveFromShoppingCart extends Action {
    type: ShoppingCartActionTypes.RemoveFromShoppingCart
    productID: number
}

export interface ShowShoppingCart extends Action {
    type: ShoppingCartActionTypes.ShowShoppingCart
}

export interface HideShoppingCart extends Action {
    type: ShoppingCartActionTypes.HideShoppingCart
}

export interface Checkout extends Action {
    type: ShoppingCartActionTypes.Checkout
    items: ShopItem[]
}

export interface CheckoutSuccess extends Action {
    type: ShoppingCartActionTypes.CheckoutSuccess
}
export interface CheckoutError extends Action {
    type: ShoppingCartActionTypes.CheckoutError
    checkoutErrorResponse: CheckoutErrorResponse
}

export interface UpdateItem extends Action {
    type: ShoppingCartActionTypes.UpdateItem
    item: ShopItem
}

export interface ShowConfirmPurchaseCompleteDialog extends Action {
    type: ShoppingCartActionTypes.ShowConfirmPurchaseCompleteDialog
}
export interface HideConfirmPurchaseCompleteDialog extends Action {
    type: ShoppingCartActionTypes.HideConfirmPurchaseCompleteDialog
}

export const shoppingCartActions = {
    AddToShoppingCart: (product: ShopItem): AddToShoppingCart => ({
        type: ShoppingCartActionTypes.AddToShoppingCart,
        product,
    }),
    RemoveFromShoppingCart: (productID: number): RemoveFromShoppingCart => ({
        type: ShoppingCartActionTypes.RemoveFromShoppingCart,
        productID,
    }),
    ShowShoppingCart: (): ShowShoppingCart => ({
        type: ShoppingCartActionTypes.ShowShoppingCart,
    }),
    HideShoppingCart: (): HideShoppingCart => ({
        type: ShoppingCartActionTypes.HideShoppingCart,
    }),
    Checkout: (items: ShopItem[]): Checkout => ({
        type: ShoppingCartActionTypes.Checkout,
        items,
    }),
    CheckoutSuccess: (): CheckoutSuccess => ({
        type: ShoppingCartActionTypes.CheckoutSuccess,
    }),
    CheckoutError: (checkoutErrorResponse: CheckoutErrorResponse): CheckoutError => ({
        type: ShoppingCartActionTypes.CheckoutError,
        checkoutErrorResponse,
    }),
    UpdateItem: (item: ShopItem): UpdateItem => ({
        type: ShoppingCartActionTypes.UpdateItem,
        item,
    }),
    ShowConfirmPurchaseCompleteDialog: (): ShowConfirmPurchaseCompleteDialog => ({
        type: ShoppingCartActionTypes.ShowConfirmPurchaseCompleteDialog,
    }),
    HideConfirmPurchaseCompleteDialog: (): HideConfirmPurchaseCompleteDialog => ({
        type: ShoppingCartActionTypes.HideConfirmPurchaseCompleteDialog,
    }),
}

export type ShoppingCartActions =
    | AddToShoppingCart
    | RemoveFromShoppingCart
    | ShowShoppingCart
    | HideShoppingCart
    | Checkout
    | CheckoutSuccess
    | CheckoutError
    | UpdateItem
    | ShowConfirmPurchaseCompleteDialog
    | HideConfirmPurchaseCompleteDialog
