import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';



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

  productos: Producto[] = [];
  nombreFiltro: string = '';
  minPrecio: number | null = null;
  maxPrecio: number | null = null;
  paginaActual: number = 1;
  totalPaginas: number = 1;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token'); 
    
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.obtenerProductos(); 
    }
  }
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

//TIENES QUE ENVIAR EL TOKENNNNNNNNNNNNNNNNN
    this.http.get<{ productos: Producto[], totalPaginas: number }>(`${environment.baseUrl}/products`, { params,  headers })
      .subscribe(response => {
        //necesito antes que todo obtener el token
        this.productos = response.productos;
        this.totalPaginas = response.totalPaginas;
      });
  }

  cambiarPagina(nuevaPagina: number): void {
    this.paginaActual = nuevaPagina;
    this.obtenerProductos();
  }
}