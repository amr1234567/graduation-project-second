export interface CartItem {
    id: string;
    productName: string;
    pictureUrl: string;
    price: number;
    category: string;
    quentity: number;
    isInCart: boolean;
}

export interface BasketModel {
    id: string;
    basketItems: CartItem[];
    deliveryMethodId: string;
    paymentMethod: 'CashOnDelivery' | 'CreditCard' | string;
}

export interface FavoriteProductsModel {
    id: string;
    items: CartItem[];
}

