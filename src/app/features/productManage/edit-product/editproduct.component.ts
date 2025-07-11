import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { Product } from 'src/app/core/interfaces/product';
import { productService } from 'src/app/core/services/editProduct.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  templateUrl: './editproduct.component.html',
   standalone: true,
  styleUrls: ['./editproduct.component.scss'],
  imports: [ ReactiveFormsModule, CommonModule],
})
export class EditProductComponent {
navigateNotPermise() {
    this.router.navigate(['/product']);
  }

  productForm: FormGroup;
  isLoading = false;
  productId: number;
  errorMessage: string | null = null;
  canEdit = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: productService,
    private authService: AuthService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.productId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam && !isNaN(Number(idParam))) {
        this.productId = Number(idParam);
        this.loadProduct();
      } else {
        this.showError('ID de producto inválido');
      }
    });
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    setTimeout(() => this.router.navigate(['/edit/:id']), 2000);
  }

  loadProduct(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) {
      this.handleError('Debes iniciar sesión para editar productos');
      return;
    }

    this.productService.getProduct(this.productId).subscribe({
      next: (product: Product) => {
        if (product.userId !== currentUserId) {
          this.handleError('No tienes permiso para editar este producto');
          return;
        }

        this.canEdit = true; // User has permission to edit
        this.productForm.patchValue({
          name: product.name,
          price: product.price,
          description: product.description
        });
        this.isLoading = false;
      },
      error: (err: string) => {
        // Updated error handling
        if (err === 'Producto no encontrado') {
          this.showError('Producto no encontrado');
        } else {
          this.showError('Error al cargar el producto');
        }
      }
    });
  }
  showError(arg0: string) {
    throw new Error('Method not implemented.');
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const productData: Partial<Product> = {
      ...this.productForm.value,
      userId: this.authService.getCurrentUserId()!
    };

    this.productService.updateProduct(this.productId, productData).subscribe({
      next: () => {
        this.router.navigate(['/edit/:id'], {
          state: { message: 'Producto actualizado exitosamente' }
        });
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.status === 403
          ? 'No tienes permiso para actualizar este producto'
          : 'Error al actualizar el producto';
      }
    });
  }

  


}