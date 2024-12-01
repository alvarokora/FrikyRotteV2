import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbManager } from '../../../managers/tmdb.manager';
import { RawgManager } from '../../../managers/rawg.manager'; // Importar el RawgManager
import { MovieDetail } from 'src/app/model/MovieModel';
import { JikanManager } from '../../../managers/jikanManager';
import { NavController} from '@ionic/angular';
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  movieDetail: MovieDetail | any = null; // Puede ser detalle de película o juego
  movies: any[] = [];  // Lista de películas
  games: any[] = [];   // Lista de juegos
  animes: any[] = [];  // Lista de animes
  hasMoreAnimes: boolean = false;
  hasMoreMovies: boolean = true;   // Para películas
  hasMoreGames: boolean = true;    // Para juegos
  type: string = '';   // Tipo de contenido: movie o game
  currentPage: number = 1; // Página actual para los animes

  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private tmdbManager: TmdbManager,
    private rawgManager: RawgManager, // Inyección del RawgManager
    private jikanManager: JikanManager, // Inyección del nuevo manager
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.type = params['type'];
      if (this.type === 'movie') {
        this.getPopularMovies();
      } else if (this.type === 'game') {
        this.getPopularGames();
      } else if (this.type === 'anime') {
        this.getPopularAnimes(); // Obtener animes
      }
    });
  }

  getPopularAnimes() {
    this.jikanManager.getPopularAnimes(this.currentPage).subscribe(
      (data: any) => {
        this.animes = data.data.slice(0, 3); // Load first 3 animes
      },
      (error) => {
        console.error('Error fetching animes:', error);
      }
    );
  }

  loadMoreAnimes(event?: any) {
    this.currentPage++;
    this.jikanManager.getPopularAnimes(this.currentPage).subscribe(
      (data: any) => {
        console.log('Datos de anime:', data); // Verificar los datos obtenidos
        if (data.data && data.data.length > 0) {
          this.animes = [...this.animes, ...data.data.slice(0, 3)];
          this.hasMoreAnimes = true;
        } else {
          this.hasMoreAnimes = false;
        }
  
        if (event) event.target.complete(); // Completar el evento de scroll
      },
      (error) => {
        console.error('Error fetching animes:', error);
        if (event) event.target.complete(); // Completar el evento de scroll incluso si hay error
      }
    );
  }
  

  // Obtener la lista de películas populares
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

  // Cargar más películas
  loadMoreMovies(event: any) {
    this.currentPage++; // Incrementa la página actual
    this.tmdbManager.getPopularMovies(this.currentPage).subscribe(
      (data: any) => {
        this.movies = [...this.movies, ...data.results]; // Concatenamos las nuevas películas
        event.target.complete(); // Completar evento de scroll
      },
      (error) => {
        console.error('Error fetching movies:', error);
        event.target.complete(); // Completar evento de scroll incluso si hay error
      }
    );
  }

  loadMoreGames(event: any) {
    this.currentPage++; // Incrementa la página actual
    this.rawgManager.getPopularGames(this.currentPage).subscribe(
      (data: any) => {
        this.games = [...this.games, ...data.results]; // Concatenamos los nuevos juegos
        event.target.complete(); // Completar evento de scroll
      },
      (error) => {
        console.error('Error fetching games:', error);
        event.target.complete(); // Completar evento de scroll incluso si hay error
      }
    );
  }

  // Obtener la lista de juegos populares
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

  // Navegar a detalle de película o juego
  selectDetail(id: number) {
    console.log('Seleccionando detalle con id:', id); // Verificar el id seleccionado
    const routeType = this.type === 'movie' ? 'movie' : this.type === 'game' ? 'game' : 'anime';
    this.router.navigate(['/detalle'], { queryParams: { id, type: routeType } });
  }
  

  // Método para obtener las estrellas llenas y medias (valoración de 0 a 5)
  getStars(voteAverage: number): { full: number[], half: number[], empty: number[] } {
    let totalStars: number;

    // Convertir la valoración al rango de 0-5
    if (this.type === 'movie') {
      totalStars = voteAverage / 2; // Si es película, pasamos de 0-10 a 0-5
    } else if (this.type === 'game' || this.type === 'anime') {
      totalStars = voteAverage; // Si es un juego o anime, ya está en rango 0-5
    }

    const fullStars = Math.floor(totalStars); // Estrellas completas
    const hasHalfStar = (totalStars - fullStars) >= 0.5; // Determinar si hay media estrella
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Estrellas vacías

    return {
      full: new Array(fullStars).fill(0), // Array con estrellas completas
      half: hasHalfStar ? [0.5] : [], // Media estrella si aplica
      empty: new Array(emptyStars).fill(0), // Estrellas vacías
    };
  }
  goBack() {
    this.navCtrl.back();
  }
}
