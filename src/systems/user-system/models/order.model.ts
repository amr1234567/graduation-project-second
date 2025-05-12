export interface ShippingAddress {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    Country: string;
}

export interface CreateOrderDto {
    deliveryMethodId: string;
    shippingAddress: ShippingAddress;
}

export interface OrderItem {
    id: string;
    product: {
        productId: string;
        productName: string;
        productUrl: string;
    };
    price: number;
    quantity: number;
    createdAt: string;
}

export interface OrderResponse {
    id: string;
    appUserId: string;
    orderDate: string;
    status: string;
    shippingAddress: ShippingAddress;
    deliveryMethod: string;
    deliveryMethodCost: number;
    items: OrderItem[];
    subTotal: number;
    total: number;
}

