import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Product } from 'src/app/core/interfaces/product';


//NO ME ESTÁ RECONOCIENDO getProduct, no sé como inicializar enel constructor....
@Component({
  selector: 'app-edit-product',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.scss']
})
export class EditProductComponent {
  productForm: FormGroup;
  isLoading = false;
  productId: number;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(+idParam)) {
      this.handleError('ID de producto no válido');
      return;
    }
    this.productId = +idParam;
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    setTimeout(() => this.router.navigate(['/products']), 2000);
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

        this.productForm.patchValue({
          name: product.name,
          price: product.price,
          description: product.description
        });
        this.isLoading = false;
      },
      error: (err: any) => {
        this.handleError(err.status === 404 
          ? 'Producto no encontrado' 
          : 'Error al cargar el producto');
      }
    });
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
        this.router.navigate(['/products'], {
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