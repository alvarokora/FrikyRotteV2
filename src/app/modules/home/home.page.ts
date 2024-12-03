import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/managers/StorageService';
import { ActivatedRoute, Router } from '@angular/router';
import { CancelAlertService } from 'src/managers/CancelAlertService';
import { UserLogoutUseCase } from 'src/app/use-cases/user-logout.user-case';
import { FavoritesService } from 'src/managers/favoriteService';  // Importar el servicio de favoritos

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: any;
  email: string = "";
  favorites: any[] = [];  // Array para almacenar los favoritos

  constructor(
    private router: Router,
    private storageService: StorageService,
    private cancelAlertService: CancelAlertService,
    private logoutUseCase: UserLogoutUseCase,
    private route: ActivatedRoute,
    private favoritesService: FavoritesService  // Inyectar el servicio de favoritos
  ) {}

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
    // Obtener los favoritos desde el servicio
    this.favorites = await this.favoritesService.getFavorites();
  }

  removeFromFavorites(itemId: any) {
    this.favoritesService.removeFavorite(itemId);
    this.loadFavorites(); // Recargar favoritos después de eliminar uno
  }
  
  loadFavorites() {
    this.favorites = this.favoritesService.getFavorites();  // Cargar nuevamente los favoritos
  }

  onIconButtonClick() {
    this.router.navigate(['/usuario'], { queryParams: { email: this.email } });
  }

  // Método que redirige a la página de detalles
  navigateToDetail(type: string) {
    this.router.navigate(['/detalle'], { queryParams: { type } });
  }
}
