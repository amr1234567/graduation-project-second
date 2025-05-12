import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeliveryMethod } from '../models/delivery-method.model';
import { SharedService } from '../../../shared/services/shared.service';
import { CreateOrderDto, OrderResponse } from '../models/order.model';

@Injectable({
    providedIn: 'root'
})
export class GlobalServices extends SharedService {

    public getDeliveryMethods(): Observable<DeliveryMethod[]> {
        return this.sendGetRequest<DeliveryMethod[]>(`/DeliveryMethod`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    public createOrder(orderData: CreateOrderDto) {
        return this.sendPostRequest<OrderResponse>(`/Order/BasketOrder`, orderData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
} 