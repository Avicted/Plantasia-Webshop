import { useDispatch } from 'react-redux'
import { ShopItem } from '../../models/ShopItem'
import { ShopItemIntent } from '../../models/ShopItemIntent'
import { shopActions } from '../../pages/shop/actions/ShopActions'
import { AddToShoppingCartButton } from '../../pages/shop/components/AddToShoppingCartButton'
const DEFAULT_IMAGE = require('../../assets/default_image.png')

interface ShopItemProps {
    product: ShopItem
    intent: ShopItemIntent
}

export const ShopItemCard: React.FunctionComponent<ShopItemProps> = ({ product, intent }) => {
    const { id, description, image_alt, image_src, name, price } = product
    const dispatch = useDispatch()

    const canBePurchased = (intent: ShopItemIntent): boolean => {
        // When is the product not for sale?
        if (intent === ShopItemIntent.MyPurchasedProduct) return false
        if (intent === ShopItemIntent.MySoldProduct) return false
        if (intent === ShopItemIntent.MyProductForSale) return false
        if (intent === ShopItemIntent.ProductForSaleAnonymos) return false

        return true
    }

    return (
        <div className="p-0 rounded-lg max-h-54 shadow-md min-w-56 bg-white card-zoom">
            <div className="flex flex-col group cursor-pointer">
                <h1 className="sr-only">Item {name}</h1>

                <div onClick={() => dispatch(shopActions.ShowProductDetails(product))}>
                    <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg rounded-b-none overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                        <img
                            src={image_src === null ? DEFAULT_IMAGE.default : image_src}
                            alt={image_alt}
                            className="card-zoom-image w-full h-52 sm:w-full sm:max-w-50 sm:max-h-52 object-center object-cover group-hover:opacity-60"
                            onError={(e: any) => {
                                e.target.onerror = null
                                e.target.src = DEFAULT_IMAGE.default
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col p-4">
                <h3 className="font-mono text-pink-500 font-bold group-hover:text-pink-600 line-clamp-2">{name}</h3>
                <p className="h-20 mt-2 text-sm font-sans text-gray-600 group-hover:text-gray-400 line-clamp-4">
                    {description}
                </p>
                <div className="flex mt-4 items-center justify-between">
                    <p className="text-pink-600 inline-flex items-center font-medium text-gray-900 group-hover:text-pink-600 font-mono">
                        <b className="font-mono inline-flex text-2xl mr-1">{price}</b>
                        <span className="inline-flex text-2xl select-none">€</span>
                    </p>
                    {canBePurchased(intent) && <AddToShoppingCartButton product={product} />}
                </div>
            </div>
        </div>
    )
}
