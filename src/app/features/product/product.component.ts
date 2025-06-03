import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { finalize } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/interfaces/product';



@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class ProductComponent implements OnInit {
  products: Product[]= [];
  filterName: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
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

    this.productService.getProducts(this.filterName, this.minPrice, this.maxPrice, this.currentPage)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
            this.products = response.products.map(product => {
          const ratings = product.comments?.map((comment: any) => comment.rating) || [];
          const averageRating = ratings.length > 0
            ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length
            : 0;

          return { ...product, averageRating }; 
        });

        console.log("Productos procesados:", this.products);
          this.totalPages = response.totalPages;
        },
        error: (error) => {
          console.error("Error al obtener productos:", error);
        }
      });
  }

  changePage(newPage: number): void {
    this.currentPage = newPage;
    this.getProducts();
  }
}
