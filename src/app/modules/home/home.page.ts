import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/managers/StorageService';
import { ActivatedRoute, Router } from '@angular/router';
import { CancelAlertService } from 'src/managers/CancelAlertService';
import { UserLogoutUseCase } from 'src/app/use-cases/user-logout.user-case';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  user: any;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private cancelAlertService: CancelAlertService,
    private logoutUseCase: UserLogoutUseCase,
    private route: ActivatedRoute
  ) {}

  email: string = "";

  ngOnInit() {
    // Obtiene el parámetro 'email' de los queryParams
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || ''; // Guarda el correo
      console.log('Email received in Home:', this.email); // Verifica que el correo se está recibiendo
    });
  }

  async ionViewDidEnter() {
    this.user = await this.storageService.get('user');
    if (!this.user) {
      console.log('No se encontraron datos del usuario.');
    }
  }

  onIconButtonClick() {
    this.router.navigate(['/usuario'], { queryParams: { email: this.email } });
  }

  onIconHomeButtonClick() {
    this.router.navigate(['/detalle']);
  }

}
