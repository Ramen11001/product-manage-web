import { Comment } from 'src/app/core/interfaces/comment';
/**
 * Interface representing a product in the system.
 *
 * @interface
 * @export
 * @class Product
 */
export interface Product {
  /**
   * Unique identifier for the product.
   * @type {number}
   */
  id: number;
  /**
   * Name of the product.
   * @type {string}
   */
  name: string;
  /**
   * Description of the product.
   * @type {string}
   */
  description: string;
  /**
   * Price of the product.
   * @type {number}
   */
  price: number;
  /**
   * User id of the product.
   * @type {number}
   */
  userId: number;
  /**
   * List of user comments associated with the product.
   * @type {Comment[]}
   * @optional
   */
  comments?: Comment[];
  /**
   * Average rating of the product based on user comments.
   * @type {number}
   * @optional
   */
  averageRating?: number;
}
