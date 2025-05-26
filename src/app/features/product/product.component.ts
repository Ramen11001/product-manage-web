import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';
import { finalize } from 'rxjs';

interface Producto {
  id: number;
  name: string;
  description: string;
  price: number;
}

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  imports: [CommonModule, FormsModule,],
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
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef)

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const token = this.authService.getToken();
    console.log('Token detectado:', token); if (token) {
    this.router.navigate(['/product']);
  }
    
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.obtenerProductos(); 
    }
  }

  //service --name getProducts()
  obtenerProductos(): void {
     const token = localStorage.getItem('token');
     const headers = {
    Authorization: `Bearer ${token}` 
  };

    const params: any = {
      search: this.nombreFiltro,
      minPrecio: this.minPrecio,
      maxPrecio: this.maxPrecio,
      pagina: this.paginaActual
    };


    this.http.get<{ productos: Producto[], totalPaginas: number }>(`${environment.baseUrl}/products`, { params,  headers })
      .pipe(finalize(() => {this.isLoading = false; console.log("Productos:", this.productos); }))
      .subscribe(response => {
     
        this.productos = response;
        this.totalPaginas = response.totalPaginas;
      });
  }

  cambiarPagina(nuevaPagina: number): void {
    this.paginaActual = nuevaPagina;
    this.obtenerProductos();
  }
}