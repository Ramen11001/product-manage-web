import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule ,ReactiveFormsModule]
})

export class LoginComponent {
  loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

  constructor(private authService: AuthService) { }

  submit() {
   console.log("El botón fue presionado.");

  if (!this.loginForm.valid) {
    console.log("El formulario no es válido.");
    return;
  }

  console.log("Ejecutando login con:", this.loginForm.value); // 👀 Verifica los datos enviados

  this.authService.login(this.loginForm.value).subscribe({
    next: (response) => { 
      console.log("Login exitoso, token recibido:", response.token);
      localStorage.setItem('token', response.token);
    },
    error: (error) => { 
      console.error('Error en autenticación:', error);
    }
  });
  }
}
