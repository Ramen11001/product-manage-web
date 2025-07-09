import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Product {
  productName: string;
  price: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreateProductService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  createProduct(productData: Product): Observable<Product> {
      console.log('Enviando a:', this.apiUrl);
  console.log('Datos enviados:', productData);
    return this.http.post<Product>(this.apiUrl, productData);
  }
}