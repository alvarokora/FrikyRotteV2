import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TmdbManager {
  private apiKey = environment.tmdb.apiKey;
  private baseUrl = environment.tmdb.baseUrl;

  constructor(private http: HttpClient) {}

  getPopularMovies(page: number = 1) {
    return this.http.get(`https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&page=${page}`);
  }
  

  // Buscar películas por título
  searchMovies(query: string): Observable<any> {
    const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}&language=en-US&page=1`;
    return this.http.get(url);

  }
    // Método para obtener detalles de la película
    getMovieDetail(movieId: number): Observable<any> {
      const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&language=en-US`;
      return this.http.get<any>(url).pipe(
        map(response => {
          const genres = response.genres.map(genre => genre.name).slice(0, 2); // Limita a los primeros dos géneros
          return { ...response, genres }; // Agrega los géneros a la respuesta
        })
      );
    }
    
}

