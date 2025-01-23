// @Note(Victor): Whenever a ShoppingItem is displayed in the app
// The possible actions a user can perform on that item depends on which
// relation the user has to the item.
// They might be the seller, the buyer, an anonymous user etc..
export enum ShopItemIntent {
    MyProductForSale = 'ShopItemIntent/MyProductForSale',
    MySoldProduct = 'ShopItemIntent/MySoldProduct',
    MyPurchasedProduct = 'ShopItemIntent/MyPurchasedProduct',
    ProductForSaleAuthenticated = 'ShopItemIntent/ProductForSaleAuthenticated',
    ProductForSaleAnonymos = 'ShopItemIntent/ProductForSaleAnonymos',
}
