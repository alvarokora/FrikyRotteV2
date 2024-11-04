import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SessionManager } from 'src/managers/SessionManager';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(private platform: Platform, private sessionManager: SessionManager, private router: Router) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    const isLoggedIn = await this.sessionManager.isLoggedIn();
  
    if (isLoggedIn) {
      console.log('Usuario autenticado, redirigiendo a home...');
      this.router.navigate(['/home']); // Redirigir a Home si la sesión está activa
    } else {
      console.log('Usuario no autenticado, redirigiendo a login...');
      this.router.navigate(['/login']); // Redirigir a Login si la sesión no está activa
    }
  }
}
