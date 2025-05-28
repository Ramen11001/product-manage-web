import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';
import { finalize } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class ProductComponent implements OnInit {
  productos: any = [];
  nombreFiltro: string = '';
  minPrecio: number | null = null;
  maxPrecio: number | null = null;
  paginaActual: number = 1;
  totalPaginas: number = 1;
  isLoading: boolean = true;

  authService: AuthService = inject(AuthService);
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  productService: ProductService= inject(ProductService);

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    console.log('Token detectado:', token);
    if (token) {
      this.router.navigate(['/product']);
    }

    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.getProducts();
    }
  }
  
    
    getProducts(): void {
    this.isLoading = true; 

    this.productService.getProducts(this.nombreFiltro, this.minPrecio, this.maxPrecio, this.paginaActual)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          console.log('Productos obtenidos:', response.productos);
          this.productos = response;
          this.totalPaginas = response.totalPaginas;
        },
        error: (error) => {
          console.error("Error al obtener productos:", error);
        }
      });
  }

  cambiarPagina(nuevaPagina: number): void {
    this.paginaActual = nuevaPagina;
    this.getProducts();
  }
}
