import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbManager } from '../../../managers/tmdb.manager';
import { RawgManager } from '../../../managers/rawg.manager'; // Importar el RawgManager
import { MovieDetail } from 'src/app/model/MovieModel';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  movieDetail: MovieDetail | any = null; // Puede ser detalle de película o juego
  movies: any[] = [];  // Lista de películas
  games: any[] = [];   // Lista de juegos
  type: string = '';   // Tipo de contenido: movie o game

  constructor(
    private activatedRoute: ActivatedRoute,
    private tmdbManager: TmdbManager,
    private rawgManager: RawgManager, // Inyección del RawgManager
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener el tipo y el ID desde los parámetros
    this.activatedRoute.queryParams.subscribe((params) => {
      this.type = params['type'];
      if (this.type === 'movie') {
        this.getPopularMovies(); // Películas populares
      } else if (this.type === 'game') {
        this.getPopularGames(); // Juegos populares
      }
    });
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
    const routeType = this.type === 'movie' ? 'movie' : 'game';
    this.router.navigate(['/detalle'], { queryParams: { id, type: routeType } });
  }

  // Método para obtener las estrellas llenas y medias (valoración de 0 a 5)
  getStars(voteAverage: number): number[] {
    let totalStars: number;
  
    // Si es una película, dividimos entre 2 (valoración de 0-10 a 0-5)
    if (this.type === 'movie') {
      totalStars = voteAverage / 2;
    } else {
      totalStars = voteAverage;  // Si es un juego, usamos la valoración directa (0-5)
    }
  
    const fullStars = Math.floor(totalStars); // Estrellas completas
    const halfStars = (totalStars - fullStars) >= 0.5 ? 1 : 0; // Si hay más de 0.5, se agrega media estrella
  
    // Llenar el array con estrellas completas y medias
    const starsArray = new Array(fullStars).fill(0);  // Estrellas completas
    if (halfStars) {
      starsArray.push(0.5);  // Añadir media estrella
    }
  
    return starsArray; // Retorna un array con las estrellas llenas y medias
  }
  
  // Método para obtener las estrellas vacías
  getEmptyStars(voteAverage: number): number[] {
    let totalStars: number;
  
    // Si es una película, dividimos entre 2 (valoración de 0-10 a 0-5)
    if (this.type === 'movie') {
      totalStars = voteAverage / 2;
    } else {
      totalStars = voteAverage;  // Si es un juego, usamos la valoración directa (0-5)
    }
  
    const fullStars = Math.floor(totalStars); // Estrellas completas
    const halfStars = (totalStars - fullStars) >= 0.5 ? 1 : 0; // Si hay más de 0.5, se agrega media estrella
  
    // Calcular cuántas estrellas vacías faltan
    const emptyStars = 5 - fullStars - halfStars;  // Las vacías son las que faltan para completar 5 estrellas
    return new Array(emptyStars).fill(0);  // Retorna un array con las estrellas vacías
  }

}
