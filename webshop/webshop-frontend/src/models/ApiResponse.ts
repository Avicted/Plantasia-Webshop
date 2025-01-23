import { ShopItem } from './ShopItem'

export interface ApiPaginatedResponse {
    count: number
    next: string | null
    previous: string | null
    results: Array<ShopItem>
}

export interface ApiResponse<T> {
    error?: string // a single error
    errors?: { [key: string]: string[] } // form field errors: <field_name: Error string>
    code?: number
    message?: string
    data: T
}
