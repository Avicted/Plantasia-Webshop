export interface ShopItem {
    id: string
    seller: {
        id: string
        username: string
        email: string
    }
    seller_id: string
    buyer_id: string | null
    name: string
    description: string
    price: number
    image_src: string
    image_alt: string
    created_at: string
    updated_at: string

    // Used in the shopping cart
    inStock?: boolean
    oldPrice?: number
    newPrice?: number
}
