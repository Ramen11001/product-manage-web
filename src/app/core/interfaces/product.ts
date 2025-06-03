export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  comments?: Comment[];
   averageRating?: number; 
}
export interface Comment {
  rating: number;
  text: string;
  userId: number;
  productId: number;
}