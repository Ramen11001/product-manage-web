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
  selector: 'app-product',
  standalone: true,
  templateUrl: './createProduct.component.html',
  styleUrls: ['./createProduct.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class createProductComponent {
  productForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
     private router: Router,
    private productService: CreateProductService,
  ) {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  //Cuando pruebo esto, sí sirve. Es algo raro en onSubmit
//pruebaClick() {
  //console.log('¡El botón funciona!');
  //alert('El botón está respondiendo');
//}

  onSubmit() {
    if (this.productForm.valid) {
    this.isLoading = true;
    
    this.productService.createProduct(this.productForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Producto creado:', response);
        this.router.navigate(['/product']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error completo:', error);
        
        // Displays specific error message
        if (error.error instanceof ErrorEvent) {
          // client error
          console.error('Error:', error.error.message);
        } else {
          // server error
          console.error(`Código de error: ${error.status}, cuerpo: ${error.error}`);
        }
      }
    });
  } else {
    this.productForm.markAllAsTouched();
  }
  }
}
