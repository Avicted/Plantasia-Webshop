export interface CheckoutErrorResponse {
    code: number
    error: string
    items_with_price_updates: {
        id: string
        old_price: number
        new_price: number
    }[]

    items_no_longer_available: { id: string }[]
}
