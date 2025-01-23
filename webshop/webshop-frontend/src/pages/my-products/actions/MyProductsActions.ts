import { Action } from 'redux'
import { ApiPaginatedResponse, ApiResponse } from '../../../models/ApiResponse'
import { CreateItemRequest } from '../../../models/CreateItemRequest'
import { ShopItem } from '../../../models/ShopItem'
import { UpdateItemRequest } from '../../../models/UpdateItemRequest'

export enum MyProductsActionTypes {
    GetMyProductsForSale = 'MyProducts/GetMyProductsForSale',
    GetMyProductsForSaleSuccess = 'MyProducts/GetMyProductsForSaleSuccess',
    GetMyProductsForSaleError = 'MyProducts/GetMyProductsForSaleError',

    GetMySoldProducts = 'MyProducts/GetMySoldProducts',
    GetMySoldProductsSuccess = 'MyProducts/GetMySoldProductsSuccess',
    GetMySoldProductsError = 'MyProducts/GetMySoldProductsError',

    GetMyPurchasedProducts = 'MyProducts/GetMyPurchasedProducts',
    GetMyPurchasedProductsSuccess = 'MyProducts/GetMyPurchasedProductsSuccess',
    GetMyPurchasedProductsError = 'MyProducts/GetMyPurchasedProductsError',

    ShowEditMyProductDialog = 'MyProducts/ShowEditMyProductDialog',
    HideEditMyProductDialog = 'MyProducts/HideEditMyProductDialog',

    ShowAddNewProductDialog = 'MyProducts/ShowAddNewProductDialog',
    HideAddNewProductDialog = 'MyProducts/HideAddNewProductDialog',

    ShowConfirmDeletionDialog = 'MyProducts/ShowConfirmDeletionDialog',
    HideConfirmDeletionDialog = 'MyProducts/HideConfirmDeletionDialog',

    CreateItem = 'MyProducts/CreateItem',
    CreateItemSuccess = 'MyProducts/CreateItemSuccess',
    CreateItemError = 'MyProducts/CreateItemError',

    DeleteItem = 'MyProducts/DeleteItem',
    DeleteItemSuccess = 'MyProducts/DeleteItemSuccess',
    DeleteItemError = 'MyProducts/DeleteItemError',

    UpdateItem = 'MyProducts/UpdateItem',
    UpdateItemSuccess = 'MyProducts/UpdateItemSuccess',
    UpdateItemError = 'MyProducts/UpdateItemError',
}

// My products for sale
export interface GetMyProductsForSale extends Action {
    type: MyProductsActionTypes.GetMyProductsForSale
    nextPage: string | null
}

export interface GetMyProductsForSaleSuccess extends Action {
    type: MyProductsActionTypes.GetMyProductsForSaleSuccess
    response: ApiResponse<ApiPaginatedResponse>
}

export interface GetMyProductsForSaleError extends Action {
    type: MyProductsActionTypes.GetMyProductsForSaleError
    error: string
}

// My sold products
export interface GetMySoldProducts extends Action {
    type: MyProductsActionTypes.GetMySoldProducts
    nextPage: string | null
}

export interface GetMySoldProductsSuccess extends Action {
    type: MyProductsActionTypes.GetMySoldProductsSuccess
    response: ApiResponse<ApiPaginatedResponse>
}

export interface GetMySoldProductsError extends Action {
    type: MyProductsActionTypes.GetMySoldProductsError
    error: string
}

// My Purchased products
export interface GetMyPurchasedProducts extends Action {
    type: MyProductsActionTypes.GetMyPurchasedProducts
    nextPage: string | null
}

export interface GetMyPurchasedProductsSuccess extends Action {
    type: MyProductsActionTypes.GetMyPurchasedProductsSuccess
    response: ApiResponse<ApiPaginatedResponse>
}

export interface GetMyPurchasedProductsError extends Action {
    type: MyProductsActionTypes.GetMyPurchasedProductsError
    error: string
}

// Edit product dialog
export interface ShowEditMyProductDialog extends Action {
    type: MyProductsActionTypes.ShowEditMyProductDialog
    product: ShopItem
}

export interface HideEditMyProductDialog extends Action {
    type: MyProductsActionTypes.HideEditMyProductDialog
}

// Add new product dialog
export interface ShowAddNewProductDialog extends Action {
    type: MyProductsActionTypes.ShowAddNewProductDialog
}

export interface HideAddNewProductDialog extends Action {
    type: MyProductsActionTypes.HideAddNewProductDialog
}

// Confirm delete item dialog
export interface ShowConfirmDeletionDialog extends Action {
    type: MyProductsActionTypes.ShowConfirmDeletionDialog
    item: ShopItem
}

export interface HideConfirmDeletionDialog extends Action {
    type: MyProductsActionTypes.HideConfirmDeletionDialog
}

// Create new product
export interface CreateItem extends Action {
    type: MyProductsActionTypes.CreateItem
    item: CreateItemRequest
}

export interface CreateItemSuccess extends Action {
    type: MyProductsActionTypes.CreateItemSuccess
}

export interface CreateItemError extends Action {
    type: MyProductsActionTypes.CreateItemError
    error: string
}

// Update an existing item
export interface UpdateItem extends Action {
    type: MyProductsActionTypes.UpdateItem
    item: UpdateItemRequest
}
export interface UpdateItemSuccess extends Action {
    type: MyProductsActionTypes.UpdateItemSuccess
}
export interface UpdateItemError extends Action {
    type: MyProductsActionTypes.UpdateItemError
    error: string
}

// Delete item
export interface DeleteItem extends Action {
    type: MyProductsActionTypes.DeleteItem
    item: ShopItem
}

export interface DeleteItemSuccess extends Action {
    type: MyProductsActionTypes.DeleteItemSuccess
    message: string
}

export interface DeleteItemError extends Action {
    type: MyProductsActionTypes.DeleteItemError
    error: string
}

export const myProductsActions = {
    GetMyProductsForSale: (nextPage: string | null): GetMyProductsForSale => ({
        type: MyProductsActionTypes.GetMyProductsForSale,
        nextPage,
    }),

    GetMyProductsForSaleSuccess: (response: ApiResponse<ApiPaginatedResponse>): GetMyProductsForSaleSuccess => ({
        type: MyProductsActionTypes.GetMyProductsForSaleSuccess,
        response,
    }),
    GetMyProductsForSaleError: (error: string): GetMyProductsForSaleError => ({
        type: MyProductsActionTypes.GetMyProductsForSaleError,
        error,
    }),

    GetMySoldProducts: (nextPage: string | null): GetMySoldProducts => ({
        type: MyProductsActionTypes.GetMySoldProducts,
        nextPage,
    }),
    GetMySoldProductsSuccess: (response: ApiResponse<ApiPaginatedResponse>): GetMySoldProductsSuccess => ({
        type: MyProductsActionTypes.GetMySoldProductsSuccess,
        response,
    }),
    GetMySoldProductsError: (error: string): GetMySoldProductsError => ({
        type: MyProductsActionTypes.GetMySoldProductsError,
        error,
    }),

    GetMyPurchasedProducts: (nextPage: string | null): GetMyPurchasedProducts => ({
        type: MyProductsActionTypes.GetMyPurchasedProducts,
        nextPage,
    }),
    GetMyPurchasedProductsSuccess: (response: ApiResponse<ApiPaginatedResponse>): GetMyPurchasedProductsSuccess => ({
        type: MyProductsActionTypes.GetMyPurchasedProductsSuccess,
        response,
    }),
    GetMyPurchasedProductsError: (error: string): GetMyPurchasedProductsError => ({
        type: MyProductsActionTypes.GetMyPurchasedProductsError,
        error,
    }),

    ShowEditMyProductDialog: (product: ShopItem): ShowEditMyProductDialog => ({
        type: MyProductsActionTypes.ShowEditMyProductDialog,
        product,
    }),
    HideEditMyProductDialog: (): HideEditMyProductDialog => ({
        type: MyProductsActionTypes.HideEditMyProductDialog,
    }),
    ShowAddNewProductDialog: (): ShowAddNewProductDialog => ({
        type: MyProductsActionTypes.ShowAddNewProductDialog,
    }),
    HideAddNewProductDialog: (): HideAddNewProductDialog => ({
        type: MyProductsActionTypes.HideAddNewProductDialog,
    }),
    ShowConfirmDeletionDialog: (item: ShopItem): ShowConfirmDeletionDialog => ({
        type: MyProductsActionTypes.ShowConfirmDeletionDialog,
        item,
    }),
    HideConfirmDeletionDialog: (): HideConfirmDeletionDialog => ({
        type: MyProductsActionTypes.HideConfirmDeletionDialog,
    }),

    CreateItem: (item: CreateItemRequest): CreateItem => ({
        type: MyProductsActionTypes.CreateItem,
        item,
    }),
    CreateItemSuccess: (): CreateItemSuccess => ({
        type: MyProductsActionTypes.CreateItemSuccess,
    }),
    CreateItemError: (error: string): CreateItemError => ({
        type: MyProductsActionTypes.CreateItemError,
        error,
    }),

    UpdateItem: (item: UpdateItemRequest): UpdateItem => ({
        type: MyProductsActionTypes.UpdateItem,
        item,
    }),
    UpdateItemSuccess: (): UpdateItemSuccess => ({
        type: MyProductsActionTypes.UpdateItemSuccess,
    }),
    UpdateItemError: (error: string): UpdateItemError => ({
        type: MyProductsActionTypes.UpdateItemError,
        error,
    }),

    DeleteItem: (item: ShopItem): DeleteItem => ({
        type: MyProductsActionTypes.DeleteItem,
        item,
    }),
    DeleteItemSuccess: (message: string): DeleteItemSuccess => ({
        type: MyProductsActionTypes.DeleteItemSuccess,
        message,
    }),
    DeleteItemError: (error: string): DeleteItemError => ({
        type: MyProductsActionTypes.DeleteItemError,
        error,
    }),
}

export type MyProductsActions =
    | GetMyProductsForSale
    | GetMyProductsForSaleSuccess
    | GetMyProductsForSaleError
    | GetMySoldProducts
    | GetMySoldProductsSuccess
    | GetMySoldProductsError
    | GetMyPurchasedProducts
    | GetMyPurchasedProductsSuccess
    | GetMyPurchasedProductsError
    | ShowEditMyProductDialog
    | HideEditMyProductDialog
    | ShowAddNewProductDialog
    | HideAddNewProductDialog
    | ShowConfirmDeletionDialog
    | HideConfirmDeletionDialog
    | CreateItem
    | CreateItemSuccess
    | CreateItemError
    | DeleteItem
    | DeleteItemSuccess
    | DeleteItemError
    | UpdateItem
    | UpdateItemSuccess
    | UpdateItemError
