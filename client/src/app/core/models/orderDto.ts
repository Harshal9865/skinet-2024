export interface OrderDto {
  email: string;
  basketId: string;
  deliveryMethodId: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}
