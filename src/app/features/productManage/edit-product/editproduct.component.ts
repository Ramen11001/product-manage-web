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
      name: ['', [Validators.minLength(3)]],
      price: [0, ],
      description: ['', Validators.minLength(10)]
    });

    this.productId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    //PARA BTENER EL ID.
    const id = this.route.snapshot.params['id']

    
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    setTimeout(() => this.router.navigate(['/edit/:']), 2000);
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
  // Marcar todos los campos como tocados para mostrar errores de validación
  this.productForm.markAllAsTouched();
  
  // Verificar si el formulario es válido después de marcar los campos
  if (this.productForm.valid) {
    // Activar estado de carga
    this.isLoading = true;
    // Limpiar mensajes de error previos
    this.errorMessage = null;

    // Preparar datos del formulario convirtiendo price a número
    const formData = {
      ...this.productForm.value,
      price: Number(this.productForm.value.price),
      // Añadir el ID del usuario actual
      userId: this.authService.getCurrentUserId()!
    };

    // Llamar al servicio para actualizar el producto
    this.productService.updateProduct(this.productId, formData).subscribe({
      next: () => {
        // Desactivar estado de carga
        this.isLoading = false;
        // Redirigir a la página de detalle del producto con mensaje de éxito
        this.router.navigate(['/edit', this.productId], {
          state: { message: 'Producto actualizado exitosamente' }
        });
      },
      error: (error) => {
        // Desactivar estado de carga
        this.isLoading = false;
        
        // Manejar diferentes tipos de errores
        if (error.status === 403) {
          this.errorMessage = 'No tienes permiso para actualizar este producto';
        } else if (error.status === 404) {
          this.errorMessage = 'Producto no encontrado';
        } else {
          this.errorMessage = 'Error al actualizar el producto: ' + 
                              (error.error?.message || error.message);
        }
      }
    });
  }
}



}