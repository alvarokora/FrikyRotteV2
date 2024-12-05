import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/managers/StorageService';
import { ActivatedRoute, Router } from '@angular/router';
import { CancelAlertService } from 'src/managers/CancelAlertService';
import { UserLogoutUseCase } from 'src/app/use-cases/user-logout.user-case';
import { FavoritesService } from 'src/managers/favoriteService';  // Importar el servicio de favoritos
import { ModalController } from '@ionic/angular';  // Importar ModalController
import { DetallesModalComponent } from '../../detalles-modal/detalles-modal.component';  // Importar el componente del modal
import { UserMoviesUseCase } from 'src/app/use-cases/user-movies.use-case';
import { UserGamesUseCase } from 'src/app/use-cases/user-games.use-case';
import { UserAnimeUseCase } from 'src/app/use-cases/user-anime.use-case';
import { GameCrudService } from 'src/managers/game-crud-service';

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
    private modalController: ModalController,
    private cancelAlertService: CancelAlertService,
    private logoutUseCase: UserLogoutUseCase,
    private route: ActivatedRoute,
    private userMoviesUseCase: UserMoviesUseCase,
    private userGamesUseCase: UserGamesUseCase,
    private userAnimeUseCase: UserAnimeUseCase,
    private gameCrudService: GameCrudService,
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

  removeFromFavorites(itemId: any, favorite: any) {
    this.favoritesService.removeFavorite(itemId);
    if (favorite.type === 'movie'){
      this.userMoviesUseCase.performDeleteMovie(itemId,this.user.uid);
    } else if (favorite.type === 'game'){
      this.userGamesUseCase.performDeleteGame(itemId,this.user.uid);
    } else if (favorite.type === 'anime'){
      this.userAnimeUseCase.performDeleteAnime(itemId,this.user.uid);
    }
    this.loadFavorites(itemId); // Recargar favoritos después de eliminar uno
  }

  loadFavorites(itemId: any) {
    this.favorites = this.favoritesService.getFavorites();  // Cargar nuevamente los favoritos
   /* this.gameCrudService.getItem(this.user.uid+itemId).subscribe(data => {
      this.favorites = data;
    });
    console.log(this.favorites);*/
  }

  onIconButtonClick() {
    this.router.navigate(['/usuario'], { queryParams: { email: this.email } });
  }

  // Método para abrir el modal con los detalles del objeto favorito
  async showDetails(favorite: any) {
    console.log(favorite.type); // Esto debería ser 'anime', 'pelicula' o 'juego'
    const tipo = favorite.type;  // Suponiendo que `favorite.type` contiene 'anime', 'pelicula' o 'juego'
    const modal = await this.modalController.create({
      component: DetallesModalComponent,
      componentProps: {
        id: favorite.id,  // ID del objeto favorito
        tipo: tipo        // Tipo del objeto (anime, pelicula, juego)
      }
    });
    return await modal.present();
  }

  // Método que redirige a la página de detalles
  navigateToDetail(type: string) {
    this.router.navigate(['/detalle'], { queryParams: { type } });
  }
}
