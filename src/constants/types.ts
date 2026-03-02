interface ProductType {
  productId: number;
  name: string;
  price: number;
}

interface Addess {
  street: string;
  city: string;
  zip: string;
}

interface Dimension {
  weight: number;
  length: number;
  width: number;
  height: number;
}

interface Shipping {
  method: string;
  trackingNumber: string | null;
  address: Addess;
  dimensions: Dimension;
}

interface OrderType {
  id: number;
  userId: number;
  products: ProductType[];
  total: number;
  status: string;
  orderDate: string;
  tags: string[];
  shipping: Shipping;
}

export type { OrderType, ProductType };
