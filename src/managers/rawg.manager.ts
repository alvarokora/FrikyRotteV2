import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RawgManager {
  private readonly baseUrl: string = 'https://api.rawg.io/api';
  private readonly apiKey: string = 'afe4a0d2f86a492d9598ebe0590fa6ba';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene una lista de juegos populares.
   * @param page Número de página de resultados (por defecto es 1).
   * @returns Observable con la lista de juegos populares.
   */
  getPopularGames(page: number = 1): Observable<any> {
    const url = `${this.baseUrl}/games?key=${this.apiKey}&page=${page}`;
    return this.http.get(url);
  }
  
  

  /**
   * Obtiene los detalles de un juego específico.
   * @param gameId ID del juego que se desea obtener.
   * @returns Observable con los detalles del juego.
   */
  getGameDetail(gameId: number): Observable<any> {
    const url = `${this.baseUrl}/games/${gameId}?key=${this.apiKey}`;
    return this.http.get(url);
  }

  /**
   * Realiza una búsqueda de juegos por nombre.
   * @param query Texto a buscar.
   * @param page Número de página de resultados (opcional).
   * @returns Observable con los resultados de la búsqueda.
   */
  searchGames(query: string, page: number = 1): Observable<any> {
    const url = `${this.baseUrl}/games?key=${this.apiKey}&search=${query}&page=${page}`;
    return this.http.get(url);
  }

  /**
   * Obtiene una lista de géneros disponibles en RAWG.
   * @returns Observable con la lista de géneros.
   */
  getGenres(): Observable<any> {
    const url = `${this.baseUrl}/genres?key=${this.apiKey}`;
    return this.http.get(url);
  }
}
