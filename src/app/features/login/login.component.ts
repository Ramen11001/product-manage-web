import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {AuthService } from 'src/app/core/services/api.service';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule]
})

export class LoginComponent {
  loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

  constructor(private authService: AuthService) { }

  submit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => { 
          localStorage.setItem('token', response.token);
        },
        error :(error: any) => { 
          console.error('Error en autenticación:', error);
        }
      });
    }
  }
}
