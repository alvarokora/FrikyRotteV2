import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbManager } from '../../../managers/tmdb.manager';
import { RawgManager } from '../../../managers/rawg.manager'; 
import { MovieDetail } from 'src/app/model/MovieModel';
import { JikanManager } from '../../../managers/jikanManager';
import { NavController } from '@ionic/angular';
import { FavoritesService } from '../../../managers/favoriteService';
import { ToastController } from '@ionic/angular';
import { UserMoviesUseCase } from 'src/app/use-cases/user-movies.use-case';
import { UserCrudService } from 'src/managers/user-crud-service';
import { StorageService } from 'src/managers/StorageService';
import { ModalController } from '@ionic/angular';
import { DetallesModalComponent } from '../../detalles-modal/detalles-modal.component';  // Importar el componente del modal



@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  id: number;  // Declaramos la propiedad 'id'
  movieDetail: MovieDetail | any = null;
  movies: any[] = [];
  games: any[] = [];
  animes: any[] = [];
  hasMoreAnimes: boolean = true;
  hasMoreMovies: boolean = true;
  hasMoreGames: boolean = true;
  type: string = '';
  currentPage: number = 1;
  searchTerm: string = '';
  filteredResults: any[] = [];
  isEndOfList: boolean = false;

  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private tmdbManager: TmdbManager,
    private rawgManager: RawgManager,
    private jikanManager: JikanManager,
    private router: Router,
    private favoritesService: FavoritesService,
    private toastController: ToastController,
    private userMoviesUseCase: UserMoviesUseCase,
    private userCrudService: UserCrudService,
    private storageService: StorageService,
    private modalController: ModalController,
  ) {}
  

   
  

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.type = params['type'];
      this.id = params['id'];  // Aquí obtienes el ID desde los queryParams
  
      // Llamamos al método correspondiente dependiendo del tipo
      if (this.type === 'movie') {
        this.getPopularMovies();
      } else if (this.type === 'game') {
        this.getPopularGames();
      } else if (this.type === 'anime') {
        this.getPopularAnimes();
      }
    });
  }

  // Dentro de tu clase DetallePage
async showDetails(item: any) {
  const modal = await this.modalController.create({
    component: DetallesModalComponent,
    componentProps: {
      id: item.id,  // Asumiendo que 'item' tiene un 'id' que necesitas
      tipo: this.type,
    },
  });
  return await modal.present();
}


  async loadFavorites() {
    try {
      const favorites = await this.favoritesService.getFavorites();
      console.log('Favorites loaded:', favorites);
      // Puedes asignar los favoritos a una propiedad si es necesario
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }


  async addToFavorites(item: any, event: Event) {
    event.stopPropagation(); // Evita la propagación del evento de clic
    try {
      const existingFavorite = await this.favoritesService.getFavorites();
      const itemId = item.mal_id || item.id;
      if (!itemId){
        console.error('No tiene un ID valido: ',item);
        return;
      }
      const isAlreadyFavorite = existingFavorite.some(
        fav => fav.id === itemId && fav.type === this.type
      );

      if (isAlreadyFavorite) {
        const toast = await this.toastController.create({
          message: 'Este favorito ya está agregado.',
          duration: 2000,
          color: 'warning',
        });
        await toast.present();
        return;
      }

      const favoriteItem = { ...item, type: this.type }; // Se asegura de agregar el tipo
      await this.favoritesService.addFavorite(favoriteItem);
      await this.loadFavorites();  // Aquí se recargan los favoritos

      const toast = await this.toastController.create({
        message: 'Añadido a favoritos',
        duration: 2000,
        color: 'success',
      });
      const user = await this.storageService.get('user');
      const uid = user.uid;
      if (this.type === 'movie'){
        await this.userMoviesUseCase.performAddMovie(item.id,uid);
      }
      await toast.present();
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Error al añadir a favoritos',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }

 async isFavorite(item: any): Promise<boolean> {
  const favorites = await this.favoritesService.getFavorites();
  return favorites.some(fav => fav.id === item.id && fav.type === item.type);
}

  loadMoreData(event: any) {
    if (this.type === 'movie') {
      this.loadMoreMovies(event);
    } else if (this.type === 'game') {
      this.loadMoreGames(event);
    } else if (this.type === 'anime') {
      this.loadMoreAnimes(event);
    }
  }

  loadMoreMovies(event: any) {
    this.currentPage++;
    this.tmdbManager.getPopularMovies(this.currentPage).subscribe(
      (data: any) => {
        if (data.results.length > 0) {
          this.movies = [...this.movies, ...data.results];
          event.target.complete();
          this.isEndOfList = false;
        } else {
          event.target.disabled = true;
          this.isEndOfList = true;
        }
      },
      (error) => {
        console.error('Error fetching movies:', error);
        event.target.complete();
      }
    );
  }

  loadMoreGames(event: any) {
    this.currentPage++;
    this.rawgManager.getPopularGames(this.currentPage).subscribe(
      (data: any) => {
        if (data.results.length > 0) {
          this.games = [...this.games, ...data.results];
          event.target.complete();
          this.isEndOfList = false;
        } else {
          event.target.disabled = true;
          this.isEndOfList = true;
        }
      },
      (error) => {
        console.error('Error fetching games:', error);
        event.target.complete();
      }
    );
  }

  loadMoreAnimes(event: any) {
    this.currentPage++;
    this.jikanManager.getPopularAnimes(this.currentPage).subscribe(
      (data: any) => {
        if (data.data.length > 0) {
          this.animes = [...this.animes, ...data.data];
          event.target.complete();
          this.isEndOfList = false;
        } else {
          event.target.disabled = true;
          this.isEndOfList = true;
        }
      },
      (error) => {
        console.error('Error fetching animes:', error);
        event.target.complete();
      }
    );
  }

  getPopularMovies() {
    this.tmdbManager.getPopularMovies().subscribe(
      (data: any) => {
        this.movies = data.results;
      },
      (error) => {
        console.error('Error fetching movies:', error);
      }
    );
  }

  getPopularGames() {
    this.rawgManager.getPopularGames().subscribe(
      (data: any) => {
        this.games = data.results;
      },
      (error) => {
        console.error('Error fetching games:', error);
      }
    );
  }

  getPopularAnimes() {
    this.jikanManager.getPopularAnimes(this.currentPage).subscribe(
      (data: any) => {
        this.animes = data.data;
      },
      (error) => {
        console.error('Error fetching animes:', error);
      }
    );
  }

selectDetail(id: number, item: any, event: Event) {
  event.stopPropagation(); // Detiene la propagación del evento de clic
  const routeType = this.type === 'movie' ? 'movie' : this.type === 'game' ? 'game' : 'anime';
  this.router.navigate(['/detalle'], { queryParams: { id, type: routeType } });
  // No se debe llamar a `addToFavorites` aquí
}

  getStars(voteAverage: number): { full: number[], half: number[], empty: number[] } {
    let totalStars = 0;
    if (typeof voteAverage === 'number' && !isNaN(voteAverage) && voteAverage > 0) {
      if (this.type === 'game') {
        totalStars = voteAverage;
      } else if (this.type === 'movie') {
        totalStars = voteAverage / 2;
      } else if (this.type === 'anime') {
        totalStars = voteAverage / 2;
      }
    } else {
      totalStars = 0;
    }
    const fullStars = Math.floor(totalStars);
    const hasHalfStar = (totalStars - fullStars) >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return {
      full: new Array(fullStars).fill(0),
      half: hasHalfStar ? [0.5] : [],
      empty: new Array(emptyStars).fill(0),
    };
  }

  onSearch() {
    const query = this.searchTerm.toLowerCase();
    if (query) {
      this.search(query);
    }
  }

  search(query: string) {
    if (this.type === 'movie') {
      this.tmdbManager.searchMovies(query).subscribe(
        (data: any) => {
          this.filteredResults = data.results.filter(result => result.vote_average > 0 && result.title);
        },
        (error) => {
          console.error('Error fetching movies:', error);
        }
      );
    } else if (this.type === 'game') {
      this.rawgManager.searchGames(query).subscribe(
        (data: any) => {
          this.filteredResults = data.results.filter(result => result.rating > 0 && result.name);
        },
        (error) => {
          console.error('Error fetching games:', error);
        }
      );
    } else if (this.type === 'anime') {
      this.jikanManager.searchAnimes(query).subscribe(
        (data: any) => {
          this.filteredResults = data.data; // Ya filtrados y ordenados en el servicio
        },
        (error) => {
          console.error('Error fetching animes:', error);
        }
      );
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
