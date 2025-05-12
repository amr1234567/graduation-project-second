import { Injectable } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import { OrderResponse } from '../models/order.model';
import { OrderModel, Page } from '../../../app/models/order.model';

@Injectable({
    providedIn: 'root'
})
export class OrdersService extends SharedService {
    public getAllOrders() {
        return this.sendGetRequest<Page<OrderModel>>('/Order/admin/Orders', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    public getAllOrdersForUser() {
        return this.sendGetRequest<OrderModel[]>('/Order/User/Orders', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    public getOrderById(id: string) {
        return this.sendGetRequest<OrderResponse>(`/Order/${id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    public deleteOrder(id: string) {
        return this.sendDeleteRequest<any>(`/Order/${id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    public updateOrder(id: string, updated: Partial<OrderResponse>) {
        return this.sendPutRequest<any>(`/Order/${id}`, updated, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
} 