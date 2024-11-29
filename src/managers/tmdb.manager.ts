import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TmdbManager {
  private apiKey = environment.tmdb.apiKey;
  private baseUrl = environment.tmdb.baseUrl;

  constructor(private http: HttpClient) {}

  // Obtener películas populares
  getPopularMovies(): Observable<any> {
    const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=en-US&page=1`;
    return this.http.get(url);
  }

  // Buscar películas por título
  searchMovies(query: string): Observable<any> {
    const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}&language=en-US&page=1`;
    return this.http.get(url);

  }
    // Método para obtener detalles de la película
    getMovieDetail(movieId: number): Observable<any> {
      const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&language=en-US`;
      return this.http.get<any>(url);
    }
}

