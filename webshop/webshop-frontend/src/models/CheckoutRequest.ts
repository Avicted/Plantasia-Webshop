interface CheckoutItem {
    id: string
    price: number
}

export interface CheckoutRequest {
    items: CheckoutItem[]
}
