import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbManager } from '../../../managers/tmdb.manager';
import { MovieDetail } from 'src/app/model/MovieModel';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  movieId: number;  // Para almacenar el ID de la película seleccionada
  movieDetail: MovieDetail | null = null;  // Para almacenar los detalles de la película
  movies: any[] = [];  // Para almacenar la lista de películas

  constructor(
    private activatedRoute: ActivatedRoute,  // Para obtener parámetros de la URL
    private tmdbManager: TmdbManager,  // El servicio que maneja las solicitudes a TMDb
    private router: Router  // Para manejar la navegación
  ) {}

  ngOnInit() {
    // Obtener el ID de la película desde la URL cuando el componente se inicializa
    this.activatedRoute.paramMap.subscribe((params) => {
      this.movieId = +params.get('id');  // Obtener el ID de la URL
      if (this.movieId) {
        this.getMovieDetail();  // Llamar a la función que obtiene los detalles de la película si el ID es válido
      }
    });

    this.getPopularMovies();  // Obtener las películas populares al cargar el componente
  }

  // Obtener la lista de películas populares
  getPopularMovies() {
    this.tmdbManager.getPopularMovies().subscribe(
      (data: any) => {
        this.movies = data.results;  // Asignar las películas obtenidas a la variable
      },
      (error) => {
        console.error('Error fetching movies:', error);  // Manejar cualquier error
      }
    );
  }

  // Obtener los detalles de la película seleccionada
  getMovieDetail() {
    this.tmdbManager.getMovieDetail(this.movieId).subscribe(
      (data: MovieDetail) => {
        this.movieDetail = data;  // Asignar los detalles de la película a la variable movieDetail
      },
      (error) => {
        console.error('Error fetching movie details:', error);  // Manejar cualquier error
      }
    );
  }

  // Cambiar la película seleccionada
  selectMovie(id: number) {
    this.router.navigate(['/detalle', id]);  // Navegar a la página de detalle pasando el nuevo id
  }
  getStarsArray() {
    const fullStars = Math.floor(this.movieDetail?.vote_average / 2);  // Redondea para obtener el número de estrellas llenas
    return new Array(fullStars).fill(0);  // Crea un array con el número de estrellas completas
  }
   // Función para obtener el número de estrellas llenas
   getStars(voteAverage: number): number[] {
    const filledStars = Math.round(voteAverage / 2);  // Convertir a 5 estrellas
    return new Array(filledStars).fill(0);  // Devolver un array con las estrellas llenas
  }

  // Función para obtener el número de estrellas vacías
  getEmptyStars(voteAverage: number): number[] {
    const filledStars = Math.round(voteAverage / 2);  // Convertir a 5 estrellas
    const emptyStars = 5 - filledStars;  // Calcular cuántas estrellas vacías deben haber
    return new Array(emptyStars).fill(0);  // Devolver un array con las estrellas vacías
  }
  goBack() {
    // Regresar a la página anterior
    window.history.back();
  }
}
