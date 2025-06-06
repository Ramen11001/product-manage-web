/**
 * Interface representing a user comment on a product.
 *
 * @interface
 * @export
 * @class Comment
 */
export interface Comment {
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
}
