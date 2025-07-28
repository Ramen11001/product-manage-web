import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/core/services/products.service';
import { Product } from 'src/app/core/interfaces/product';
import { Comment } from 'src/app/core/interfaces/comment';
import { User } from 'src/app/core/interfaces/user';
import { CommentsService } from 'src/app/core/services/comment.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-products-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products-details.component.html',
})
export class ProductsDetailsComponent implements OnInit {
  product: Product | null = null;
  comments: Comment[] = [];
  users: User[]=[];
  commentForm: FormGroup;
  isLoading = true;
  error: string | null = null;
  formValue: any;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private commentsService: CommentsService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    /**
     * Initializes the comment form with validation rules:
     * - Text: Required, minimum 3 characters
     * - Rating: Required, between 1-5 stars
     */
    this.commentForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(3)]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(parseInt(productId));
    } else {
      this.error = 'Producto no encontrado';
      this.isLoading = false;
    }
  }
  /**
   * Loads product details by ID.
   * - Sets loading state during request
   * - On success: Loads associated comments
   * - On error: Displays error message
   *
   * @param {number} id - Product ID to load
   */
  loadProduct(id: number): void {
    this.isLoading = true;
    this.productsService.getProductId(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loadComments(id);
      },
      error: (err) => {
        this.error = 'Error al cargar el producto';
        this.isLoading = false;
        console.error(err);
      },
    });
  }
  /**
   * Loads comments for a specific product.
   * - Handles user data mapping for comments
   * - Updates loading state and error handling
   *
   * @param {number} productId - ID of the product to load comments for
   */
  loadComments(productId: number): void {
    this.commentsService.getCommentsByProduct(productId).subscribe({
      next: (comments) => {
        this.comments = comments.map((comment) => {
          if (comment.userId && !comment.user) {
          }
          return comment;
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los comentarios';
        this.isLoading = false;
        console.error(err);
      },
    });
  }
  /**
   * Handles comment form submission.
   * - Validates form and authentication
   * - Creates new comment via service
   * - Resets form on success
   */
  onSubmit(): void {
    if (this.commentForm.invalid || !this.product) return;

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/product']);
      return;
    }

    const commentData = {
      text: this.commentForm.value.text,
      rating: Number(this.commentForm.value.rating),
      productId: this.product.id,      
    }

    this.commentsService.createComment(null, commentData).subscribe({
      next: (comment) => {
        this.comments.unshift(comment);
        this.commentForm.reset({ text: '', rating: 5 });
      },
      error: (err) => {
        this.error = 'Error al enviar el comentario';
        console.error(err);
      },
    });
  }
  /**
   * Checks if user is authenticated.
   * @returns {boolean} Authentication status
   */
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
  /**
   * Deletes a comment by ID.
   * - Validates comment ID
   * - Updates comments list after successful deletion
   *
   * @param {number} commentId - ID of the comment to delete
   */
  deleteComment(commentId: number): void {
    if (!commentId) {
      console.error('ID de comentario no válido');
      return;
    }

    this.commentsService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter((c) => c.id !== commentId);
      },
      error: (err) => {
        console.error('Error al eliminar comentario:', err);
      },
    });
  }

  /**
   * Navigates to the product page.
   * Uses Angular Router to navigate to '/product' route.
   * @returns {void}
   */
  navigateToProduct() {
    this.router.navigate(['/product']);
  }

}
