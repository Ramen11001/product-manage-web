import { Comment } from 'src/app/core/interfaces/comment' ;
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  comments?: Comment[];
   averageRating?: number; 
}
