import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionManager } from 'src/managers/SessionManager';

@Injectable({
  providedIn: 'root',
})
export class SessionGuard implements CanActivate {
  constructor(private sessionManager: SessionManager, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const isLoggedIn = await this.sessionManager.isLoggedIn();
    if (isLoggedIn) {
      return true; // Permitir el acceso
    } else {
      this.router.navigate(['/login']); // Redirigir a login si no está autenticado
      return false; // Bloquear el acceso
    }
  }
}
