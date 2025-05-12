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
    console.log("ejecutando");
    if (this.loginForm.valid) {
      console.log("ejecutando 1");
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => { 
          localStorage.setItem('token', response.token);
          console.log("ejecutando 2");
        },
        error :(error: any) => { 
          console.error('Error en autenticación:', error);
        }
      });
    }
  }
}
