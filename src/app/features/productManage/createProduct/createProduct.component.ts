import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateProductService } from 'src/app/core/services/createUser.service';
/**
 * Component representing the login functionality.
 *
 * @component
 * @class createUserComponent
 */


@Component({
  selector: 'app-create-product',
  standalone: true,
  templateUrl: './createProduct.component.html',
  styleUrls: ['./createProduct.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class CreateProductComponent {
  productForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: CreateProductService
  ) {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3)]],
      price: [null, [Validators.required, Validators.min(0)]], 
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    // Mark all fields as touched to show errors
    this.productForm.markAllAsTouched();
    
    if (this.productForm.valid) {
      this.isLoading = true;
      
      // Convertir price a número
      const formData = {
        ...this.productForm.value,
        price: Number(this.productForm.value.price)
      };

      this.productService.createProduct(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/product']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error:', error);
          alert('Error al crear producto: ' + (error.error?.message || error.message));
        }
      });
    }
  }
}

