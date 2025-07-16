// src/app/core/models/delivery-method.ts

export interface IDeliveryMethod {
  id: number;
  shortName: string;
  description: string;
  price: number;
  deliveryTime: string;
}
