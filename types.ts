
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string; // Can be an emoji or a data/http URL
  gallery: string[];
}

export interface Category {
  name: string;
  products: Product[];
}

export interface StoreData {
  name: string;
  logo: string;
  featuredModel: {
    title: string;
    image: string;
    description: string;
    gallery: string[];
  };
  categories: {
    [key: string]: Category;
  };
  footer: {
    mainText: string;
    copyrightText: string;
  };
}

export interface NotificationType {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}