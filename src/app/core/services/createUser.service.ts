import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class createProductService {
    /**
   * Base URL
   * @type {string}
   * @private
   */
  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  // Make an HTTP POST request to save the products
  createProduct(productData: any): Observable<any> {
    return this.http.post(this.apiUrl, productData);
  }
}