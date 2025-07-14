// Import necessary modules and services for the component
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { finalize } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/interfaces/product';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { EditProductComponent } from '../productManage/edit-product/editproduct.component';
/**
 * Component representing the product view and functionalities.
 *
 * @component
 * @class ProductComponent
 */
@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ProductComponent implements OnInit {
  navigateToCreateProduct() {
    this.router.navigate(['/createProduct']);
  }
navigateToEditProduct() {
    this.router.navigate(['edit/:id']);
  }
  /**
   * Stores the list of retrieved products.
   * @type {Product[]}
   */
  products: Product[] = [];
  /**
   * Stores the search filter for product names.
   * @type {string}
   */
  filterName: string = '';

  /**
   * Stores the minimum price filter.
   * @type {number | null}
   */
  minPrice: number | null = null;
  /**
   * Stores the maximum price filter.
   * @type {number | null}
   */
  maxPrice: number | null = null;
  /**
   * Tracks the current page in the pagination system.
   * @type {number}
   */
  currentPage: number = 1;
  /**
   * Specifies the maximum number of products to display per page.
   *
   * @type {number}
   */
  itemsPerPage: number = 13;
  /**
   * Indicates whether there are more products to fetch beyond the current page.
   *
   * @type {boolean}
   */
  hasMore = false;

  isLoading: boolean = true;
  // Dependency injection for required services
  authService: AuthService = inject(AuthService);
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  productService: ProductService = inject(ProductService);

  //Reactive Form
  filterForm: FormGroup = new FormGroup({
    filterName: new FormControl(''),
    minPrice: new FormControl(null),
    maxPrice: new FormControl(null),
  });
  /**
   * Initializes ProductComponent and manages user authentication redirection.
   *
   * @constructor
   * @param {Router} router - Manages route navigation.
   * @param {HttpClient} http - Handles HTTP requests.
   */
  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.getProducts();

      this.filterForm.valueChanges.subscribe((values) => {
        this.currentPage = 1;
        this.getProducts();
      });
    }
  }

  /**
   * Retrieves products from the backend using search filters and pagination.
   * - Calls `ProductService.getProducts()`.
   * - Maps retrieved products to calculate their average rating.
   * - Updates the `products` array.
   */
  getProducts(): void {
    this.isLoading = true;
    const { filterName, minPrice, maxPrice } = this.filterForm.value;
    this.productService
      .getProducts(
        filterName,
        minPrice,
        maxPrice,
        this.currentPage,
        this.itemsPerPage,
      )
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: Product[]) => {
          this.products = response.map((product: Product) => {
            const ratings =
              product.comments?.map((comment) => comment.rating) || [];
            const averageRating =
              ratings.length > 0
                ? ratings.reduce(
                    (sum: number, rating: number) => sum + rating,
                    0,
                  ) / ratings.length
                : 0;
            return { ...product, averageRating };
          });
          // If the number of products equals the items per page, assume that more products are available.
          this.hasMore = this.products.length === this.itemsPerPage;
        },
        error: (error) => {
          console.error('Error al obtener productos:', error);
        },
      });
  }
  /**
   * Handles pagination by updating the current page and fetching products for the new page.
   *
   * @function
   * @param {number} newPage - The page number to navigate to.
   */
  changePage(newPage: number): void {
    if (newPage < 1) return;
    this.currentPage = newPage;
    this.getProducts();
  }
  /**
   * Advances to the next page if more products are available.
   *
   * @function
   */
  nextPage(): void {
    if (this.hasMore) {
      this.changePage(this.currentPage + 1);
    }
  }
  /**
   * Returns to the previous page if currently beyond the first page.
   *
   * @function
   */
  prevPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  getUserId() {}
}
