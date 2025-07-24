import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
//Algunas cosas no funcionan porque falta mergear la otra rama
import { ProductsService } from 'src/app/core/services/products.service';
import { Product } from 'src/app/core/interfaces/product';
import { Comment } from 'src/app/core/interfaces/comment';
import { CommentsService } from 'src/app/core/services/comment.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    this.commentForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(3)]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
   
  }

  ngOnInit():void{
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(parseInt(productId));
    } else {
      this.error = 'Producto no encontrado';
      this.isLoading = false;
    }
  }

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
      }
    });
  }

 loadComments(productId: number): void {
  this.commentsService.getCommentsByProduct(productId).subscribe({
    next: (comments) => {
      this.comments = comments.map(comment => {
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
    }
  });
}

  onSubmit(): void {
  if (this.commentForm.invalid || !this.product) return;

  if (!this.authService.isAuthenticated()) {
    this.router.navigate(['/product']);
    return;
  }

  
  
  // Convert rating to number type for API
      const formValue = {
        ... this.commentForm.value,
       rating: Number(this.formValue.value.rating),
      };

  this.commentsService.createComment(formValue).subscribe({
    next: (comment) => {
      this.comments.unshift(comment);
      this.commentForm.reset({ text: '', rating: 5 });
      if (this.product) {
        this.updateProductAverageRating();
      }
    },
    error: (err) => {
      this.error = 'Error al enviar el comentario';
      console.error(err);
    }
  });
}

  updateProductAverageRating(): void {
    if (!this.product) return;
    
    const total = this.comments.reduce((sum, comment) => sum + comment.rating, 0);
    this.product.averageRating = total / this.comments.length;
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}