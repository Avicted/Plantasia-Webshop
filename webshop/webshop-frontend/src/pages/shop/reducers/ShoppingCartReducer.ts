import produce from 'immer'
import { ShopItem } from '../../../models/ShopItem'
import { ShoppingCartActions, ShoppingCartActionTypes } from '../actions/ShoppingCartActions'

// State definition
interface ShoppingCartState {
    productsInBasket: ShopItem[]
    showShoppingCart: boolean
    error: string
    checkoutComplete: boolean
    showConfirmPurchaseCompleteDialog: boolean
}

const initialState: ShoppingCartState = {
    productsInBasket: [],
    showShoppingCart: false,
    error: '',
    checkoutComplete: false,
    showConfirmPurchaseCompleteDialog: false,
}

export function shoppingCartReducer(state: ShoppingCartState = initialState, action: ShoppingCartActions) {
    switch (action.type) {
        case ShoppingCartActionTypes.AddToShoppingCart:
            return produce(state, (draft) => {
                draft.productsInBasket.push(action.product)
            })
        case ShoppingCartActionTypes.RemoveFromShoppingCart:
            return produce(state, (draft) => {
                draft.productsInBasket = draft.productsInBasket.filter(
                    (product) => product.id.toString() !== action.productID.toString()
                )
            })
        case ShoppingCartActionTypes.ShowShoppingCart:
            return produce(state, (draft) => {
                draft.showShoppingCart = true
            })
        case ShoppingCartActionTypes.HideShoppingCart:
            return produce(state, (draft) => {
                draft.showShoppingCart = false
            })
        case ShoppingCartActionTypes.Checkout:
            return produce(state, (draft) => {
                draft.error = ''
                draft.checkoutComplete = false
            })
        case ShoppingCartActionTypes.CheckoutSuccess:
            return produce(state, (draft) => {
                draft.showShoppingCart = true
                draft.checkoutComplete = true
            })
        case ShoppingCartActionTypes.CheckoutError:
            return produce(state, (draft) => {
                draft.showShoppingCart = true
                draft.error = action.checkoutErrorResponse.error

                const { items_no_longer_available, items_with_price_updates } = action.checkoutErrorResponse

                console.log({
                    info: 'ShoppingCartActionTypes.CheckoutError',
                    action,
                    'items_no_longer_available.length': items_no_longer_available.length,
                    'items_with_price_updates.length': items_with_price_updates.length,
                })

                for (let i = 0; i < items_no_longer_available.length; i++) {
                    const item: ShopItem | undefined = draft.productsInBasket.find(
                        (p) => p.id === items_no_longer_available[i].id
                    )

                    if (item !== undefined) {
                        draft.productsInBasket.map((p) => {
                            if (p.id === item.id) {
                                p.inStock = false
                            }
                        })
                    }
                }

                for (let i = 0; i < items_with_price_updates.length; i++) {
                    const { id, old_price, new_price } = items_with_price_updates[i]

                    console.log({
                        id,
                    })

                    const item: ShopItem | undefined = draft.productsInBasket.find(
                        (p) => parseInt(p.id) === parseInt(id)
                    )

                    console.log({
                        info: 'ShoppingCartActionTypes.CheckoutError',
                        item,
                    })

                    if (item !== undefined) {
                        draft.productsInBasket.map((p) => {
                            if (p.id === item.id) {
                                p.oldPrice = old_price
                                p.newPrice = new_price

                                // Update the wrong price of the item in the basket
                                p.price = new_price
                            }
                        })
                    }
                }
            })

        case ShoppingCartActionTypes.UpdateItem:
            return produce(state, (draft) => {
                console.log({
                    info: 'ShoppingCartActionTypes.UpdateItem',
                    'action.item': action.item,
                })

                draft.productsInBasket.map((p, index) => {
                    if (parseInt(p.id) === parseInt(action.item.id)) {
                        console.log({
                            info: 'ShoppingCartActionTypes.UpdateItem map',
                            'action.item': action.item,
                            'map object': p,
                        })

                        draft.productsInBasket[index] = action.item
                    }
                })
            })

        case ShoppingCartActionTypes.ShowConfirmPurchaseCompleteDialog:
            return produce(state, (draft) => {
                draft.showConfirmPurchaseCompleteDialog = true
            })

        case ShoppingCartActionTypes.HideConfirmPurchaseCompleteDialog:
            return produce(state, (draft) => {
                draft.showConfirmPurchaseCompleteDialog = false

                // Reset the items in the shopping basket
                draft.productsInBasket = []
            })

        default:
            return state
    }
}
