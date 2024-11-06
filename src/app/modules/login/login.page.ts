import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionManager } from 'src/managers/SessionManager';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private sessionManager: SessionManager) { }

  ngOnInit() { }

  async onLoginButtonPressed() {

    try{
      const userCredential = await this.sessionManager.loginWith(this.email, this.password)
      const user = userCredential.user
      if (user) {
        console.log('Usuario autenticado: ',user);
      }
    } catch (error){
      console.error('Error al iniciar sesion: ',error);
      alert('Error')
    }
  }
   /* // Asegúrate de que este método sea async
    const isLoggedIn = await this.sessionManager.performLogin(this.email, this.password); // Usa await aquí
    
    if (isLoggedIn) {
      // Navega a la vista de Home y pasa el parámetro email
      this.router.navigate(['/home'], { queryParams: { email: this.email } });
    } else {
      // Reinicia las credenciales en caso de fallo
      this.email = '';
      this.password = '';
      alert('Las credenciales ingresadas son inválidas o ya hay una sesión activa.');
    }
  }*/

  onRegisterButtonPressed() {
    this.router.navigate(['/register']);
  }
}
