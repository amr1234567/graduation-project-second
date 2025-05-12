import { Injectable, inject } from '@angular/core';
import { DeliveryMethod } from '../models/delivery-method.model';
import { Observable } from 'rxjs';
import { SharedService } from '../../../shared/services/shared.service';

@Injectable({
    providedIn: 'root'
})
export class DeliveryMethodsService extends SharedService {
    customBase = 'delivery-methods';

    getAllDeliveryMethods(): Observable<DeliveryMethod[]> {
        return this.sendGetRequest<DeliveryMethod[]>('/deliveryMethod');
    }

    createDeliveryMethod(method: {
        shortName: string;
        description: string;
        deliveryTime: string;
        cost: number
    }) {
        return this.sendPostRequest<DeliveryMethod>(this.customBase, method);
    }

    updateDeliveryMethod(id: string, method: Partial<DeliveryMethod>): Observable<DeliveryMethod> {
        return this.sendPutRequest<DeliveryMethod>(`${this.customBase}/${id}`, method);
    }

    deleteDeliveryMethod(id: string): Observable<void> {
        return this.sendDeleteRequest(`${this.customBase}/${id}`);
    }
} 