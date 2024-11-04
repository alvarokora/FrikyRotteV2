import { Injectable } from '@angular/core';
import { StorageService } from 'src/managers/StorageService';

@Injectable({
  providedIn: 'root',
})
export class SessionManager {
  private readonly temporaryUserName: string = 'user';
  private readonly temporaryPass: string = 'pass';

  constructor(private storageService: StorageService) {}

  async isLoggedIn(): Promise<boolean> {
    const session = await this.storageService.get('isSessionActive');
    console.log('Session active:', session); // Verifica el valor de la sesión
    return session === true; // Verifica si la sesión está activa
  }

  async performLogin(user: string, password: string): Promise<boolean> {
    const isAlreadyLoggedIn = await this.isLoggedIn(); // Verifica si ya está logueado

    if (isAlreadyLoggedIn) {
      // Aquí podrías lanzar un error, un mensaje de alerta, o simplemente devolver false
      console.log('Ya hay una sesión activa.'); // Mensaje de depuración
      return false; // No se permite iniciar sesión si ya hay una sesión activa
    }

    if (user === this.temporaryUserName && password === this.temporaryPass) {
      await this.storageService.set('isSessionActive', true); // Guardar estado de sesión activa
      console.log('Sesión iniciada correctamente.'); // Mensaje de depuración
      return true;
    } else {
      console.log('Credenciales inválidas.'); // Mensaje de depuración
      return false;  
    }  
  }

  async performLogout() {
    await this.storageService.remove('isSessionActive'); // Eliminar sesión activa
    console.log('Sesión cerrada.'); // Mensaje de depuración
  }

  
}
