export interface OrderItem {
  productId: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  orderDate: string;
  status: string;
  deliveryMethod: string;
  shippingPrice: number;
  subtotal: number;
  total: number;
  orderItems: OrderItem[];
}
