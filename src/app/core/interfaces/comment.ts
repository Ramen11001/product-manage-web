/**
 * Interface representing a user comment on a product.
 *
 * @interface
 * @export
 * @class Comment
 */
export interface Comment {
  /**
   * Unique identifier for the comment.
   * @type {number}
   */
  id?: number;
  /**
   * Rating given by the user (usually between 1-5 stars).
   * @type {number}
   */
  rating: number;

  /**
   * Text content of the comment.
   * @type {string}
   */
  text: string;

  /**
   * Unique identifier of the user who posted the comment.
   * @type {number}
   */
  userId: number;
  /**
   * Unique identifier of the product to which the comment belongs.
   * @type {number}
   */
  productId: number;
  createdAt?: string;
  /**
   * Identifier of the user name.
   * @type {number}
   */
  user?: {
    username?: string;
  };
}
