import { useDispatch, useSelector } from 'react-redux'
import { ShopItem } from '../../../models/ShopItem'
import { accountActions } from '../../account/actions/AccountActions'
import { shopActions } from '../actions/ShopActions'
import { shoppingCartActions } from '../actions/ShoppingCartActions'
import { v4 as uuidv4 } from 'uuid'
import { NotificationType } from '../../../models/NotificationData'
import { AppState } from '../../../framework/store/rootReducer'

interface AddToShoppingCartButtonProps {
    product: ShopItem
}

export const AddToShoppingCartButton: React.FunctionComponent<AddToShoppingCartButtonProps> = ({ product }) => {
    const dispatch = useDispatch()
    const productsInBasket: ShopItem[] = useSelector((state: AppState) => state.shoppingCart.productsInBasket)

    return (
        <button
            type="button"
            onClick={() => {
                dispatch(shoppingCartActions.AddToShoppingCart(product))
                dispatch(shopActions.HideProductDetails())
                dispatch(
                    accountActions.ShowNotification({
                        id: uuidv4(),
                        title: product.name,
                        message: 'Has been added to the cart :)',
                        type: NotificationType.Success,
                        dismissed: false,
                    })
                )
            }}
            className="disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-default inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-pink-500 bg-pink-100 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            disabled={productsInBasket.includes(product)}
        >
            Add to cart
        </button>
    )
}
