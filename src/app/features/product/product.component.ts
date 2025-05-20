import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl,} from '@angular/forms';
@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  imports: [CommonModule],
})
export class ProductComponent {

  /**
   * Initializes ProductComponent.
   *
   * @constructor
   * @param {Router} router - Manages route navigation.
   */
  constructor(
    private router: Router,
  ) {
  }

  
}