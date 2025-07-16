import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { Product } from 'src/app/core/interfaces/product';
import { ProductsService } from 'src/app/core/services/products.service';
import { CommonModule } from '@angular/common';
/**
 * Component for editing existing products.
 * Provides a form to modify product details and handles submission to the API.
 * Includes permission checks to ensure only product owners can edit.
 * 
 * @component
 * @selector app-edit-product
 * @standalone true
 */
@Component({
  selector: 'app-edit-product',
  templateUrl: './editproduct.component.html',
  standalone: true,
  styleUrls: ['./editproduct.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class EditProductComponent {
  /**
    * Form group for product editing.
    * Contains fields: name, price, description.
    * @type {FormGroup}
    */
  productForm: FormGroup;
  /**
  * Loading state indicator.
  * Set to true during data loading or form submission.
  * @type {boolean}
  */
  isLoading = false;
  /**
   * ID of the product being edited.
   * Retrieved from route parameters.
   * @type {number}
   */
  productId: number;
  /**
  * Error message to display to the user.
  * @type {string | null}
  */
  errorMessage: string | null = null;
  /**
  * Flag indicating if the current user has edit permission.
  * Set to true if authenticated user is the product owner.
  * @type {boolean}
  */
  canEdit = false;
  /**
   * Component constructor.
   * Initializes the product form and retrieves product ID from route.
   * 
   * @param {FormBuilder} fb - Angular form builder service
   * @param {ActivatedRoute} route - Activated route service
   * @param {Router} router - Angular router for navigation
   * @param {ProductsService} productService - Product API service
   * @param {AuthService} authService - Authentication service
   */
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsService,
    private authService: AuthService
  ) {
    // Initialize form with validation rules
    this.productForm = this.fb.group({
      name: ['', [Validators.minLength(3)]],
      price: [0,],
      description: ['', Validators.minLength(10)]
    });

    // Initialize form with validation rules
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.loadProduct();


  }
  /**
    * Handles errors by displaying a message and navigating after delay.
    * @private
    * @param {string} message - Error message to display
    */
  private handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    setTimeout(() => this.router.navigate(['/edit/:']), 2000);
  }
  /**
    * Loads product data from API and checks edit permissions.
    * - Verifies user authentication
    * - Checks if current user owns the product
    * - Populates form with product data
    * @private
    */
  loadProduct(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) {
      this.handleError('Debes iniciar sesión para editar productos');
      return;
    }

    this.productService.getProductId(this.productId).subscribe({
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

  /**
    * Handles form submission for product updates.
    * - Validates form inputs
    * - Converts price to number
    * - Calls product service to update product
    * - Navigates to product list on success
    * - Handles errors with appropriate messages
    */
  onSubmit(): void {
    // Trigger validation UI for all fields
    this.productForm.markAllAsTouched();

    // Proceed only if form is valid
    if (this.productForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      // Prepare form data with type conversions
      const formData = {
        ...this.productForm.value,
        price: Number(this.productForm.value.price),
        userId: this.authService.getCurrentUserId()!
      };

      // Call product service to update product
      this.productService.saveProduct(this.productId, formData).subscribe({
        next: () => {
          // Desactivar estado de carga
          this.isLoading = false;
          // Navigate to product list with success message
          this.router.navigate(['/product'], {
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