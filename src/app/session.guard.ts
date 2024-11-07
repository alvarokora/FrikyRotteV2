import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from 'src/managers/StorageService';

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {

  constructor(private router: Router, private storageService: StorageService) {}

  async canActivate(): Promise<boolean> {
    const session = await this.storageService.get('isSessionActive');
    if (session) {
      return true; 
    } else {
      this.router.navigate(['/login']);  
      return false;  
    }
  }
}
