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

  onLoginButtonPressed() {
    if (this.sessionManager.performLogin(this.email, this.password)) {
      // Navega a la vista de Home y pasa el parámetro email
      this.router.navigate(['/home'], { queryParams: { email: this.email } });
    } else {
      this.email = '';
      this.password = '';
      alert('Las credenciales ingresadas son inválidas.');
    }
  }

  onRegisterButtonPressed() {
    this.router.navigate(['/register']);
  }
}
