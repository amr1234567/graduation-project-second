export interface OrderModel {
    orderId: string;
    status: string;
    deliveryMethod: string;
    total: number;
    orderCreatedAt: Date;
    numberOfProductsItems: number;
    paymentMethod: string;
}

export interface Page<T> {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    orders: T[];
} 