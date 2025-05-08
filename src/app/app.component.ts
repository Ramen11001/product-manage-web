import { Component } from '@angular/core';
import { FormControl, } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [ HttpClientModule],
})
export class AppComponent {
  title = 'product-manage-web';
  selection = { value: 'default' };
  name = new FormControl('');
}


