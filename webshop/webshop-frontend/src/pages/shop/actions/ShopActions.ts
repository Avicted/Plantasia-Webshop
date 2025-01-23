import { Action } from 'redux'
import { ApiResponse, ApiPaginatedResponse } from '../../../models/ApiResponse'
import { ShopItem } from '../../../models/ShopItem'

export enum ShopActionTypes {
    GetAllProducts = 'Shop/GetAllProducts',
    GetAllProductsSuccess = 'Shop/GetAllProductsSuccess',
    GetAllProductsError = 'Shop/GetAllProductsError',

    ShowProductDetails = 'Shop/ShowProductDetails',
    HideProductDetails = 'Shop/HideProductDetails',

    SearchByName = 'Shop/SearchByName',
    SearchByNameResult = 'Shop/SearchByNameResult',
    ResetSearch = 'Shop/ResetSearch',
}

export interface GetAllProducts extends Action {
    type: ShopActionTypes.GetAllProducts
    nextPage: string | null
}

export interface GetAllProductsSuccess extends Action {
    type: ShopActionTypes.GetAllProductsSuccess
    response: ApiResponse<ApiPaginatedResponse>
}

export interface GetAllProductsError extends Action {
    type: ShopActionTypes.GetAllProductsError
    error: string
}

export interface ShowProductDetails extends Action {
    type: ShopActionTypes.ShowProductDetails
    product: ShopItem
}

export interface HideProductDetails extends Action {
    type: ShopActionTypes.HideProductDetails
}

export interface SearchByName extends Action {
    type: ShopActionTypes.SearchByName
    name: string
    nextPage: string | null
    history: any
}

export interface SearchByNameResult extends Action {
    type: ShopActionTypes.SearchByNameResult
    result: ApiResponse<ApiPaginatedResponse>
}

export interface ResetSearch extends Action {
    type: ShopActionTypes.ResetSearch
}

export const shopActions = {
    GetAllProducts: (nextPage: string | null): GetAllProducts => ({
        type: ShopActionTypes.GetAllProducts,
        nextPage,
    }),
    GetAllProductsSuccess: (response: ApiResponse<ApiPaginatedResponse>): GetAllProductsSuccess => ({
        type: ShopActionTypes.GetAllProductsSuccess,
        response,
    }),
    GetAllProductsError: (error: string): GetAllProductsError => ({
        type: ShopActionTypes.GetAllProductsError,
        error,
    }),
    ShowProductDetails: (product: ShopItem): ShowProductDetails => ({
        type: ShopActionTypes.ShowProductDetails,
        product,
    }),
    HideProductDetails: (): HideProductDetails => ({
        type: ShopActionTypes.HideProductDetails,
    }),
    SearchByName: (name: string, nextPage: string | null, history: any): SearchByName => ({
        type: ShopActionTypes.SearchByName,
        name,
        nextPage,
        history,
    }),
    SearchByNameResult: (result: ApiResponse<ApiPaginatedResponse>): SearchByNameResult => ({
        type: ShopActionTypes.SearchByNameResult,
        result,
    }),
    ResetSearch: (): ResetSearch => ({
        type: ShopActionTypes.ResetSearch,
    }),
}

export type ShopActions =
    | GetAllProducts
    | GetAllProductsSuccess
    | GetAllProductsError
    | ShowProductDetails
    | HideProductDetails
    | SearchByName
    | SearchByNameResult
    | ResetSearch
