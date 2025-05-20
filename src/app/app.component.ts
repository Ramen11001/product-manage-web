import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
/**
 * Root component of the application.
 * Manages global settings and serves as the main entry point.
 *
 * @component
 * @class AppComponent
 */
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [HttpClientModule, RouterModule],
})
export class AppComponent {
  /**
   * Root component of the application.
   * Manages global settings and serves as the main entry point.
   *
   * @component
   * @class AppComponent
   */
  title = 'product-manage-web';
  /**
   * Stores the current selection state.
   *
   * @type {object}
   * @property {string} value - The currently selected value.
   */
  selection = { value: 'default' };

  /**
   * Form control for managing user input.
   *
   * @type {FormControl}
   */
  name = new FormControl('');
}
