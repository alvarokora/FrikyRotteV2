import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) { } // Inyectar el Router

  ngOnInit() {
    // Inicializaciones si son necesarias
  }

  onRegisterButtonPressed() {
    console.log('Correo:', this.email);
    console.log('Usuario:', this.username);
    console.log('Contraseña:', this.password);
    console.log('Confirmar Contraseña:', this.confirmPassword);
    
    // Lógica de validación o registro aquí...

    // Redirigir al login después del registro exitoso
    this.router.navigate(['/login']); // Cambiar la ruta a la página de login
  }
}
