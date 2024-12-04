import { Injectable } from '@angular/core';
import { JikanManager } from '../managers/jikanManager';
import { TmdbManager } from '../managers/tmdb.manager';
import { RawgManager } from '../managers/rawg.manager';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DetallesService {
  constructor(
    private jikanManager: JikanManager,
    private tmdbManager: TmdbManager,
    private rawgManager: RawgManager
  ) {}

  getDetalle(id: number, tipo: 'anime' | 'movie' | 'game'): Observable<any> {
    if (tipo === 'anime') {
      return this.jikanManager.getAnimeDetail(id);  // Obtiene detalles de anime
    } else if (tipo === 'movie') {
      return this.tmdbManager.getMovieDetail(id);  // Obtiene detalles de película
    } else if (tipo === 'game') {
      return this.rawgManager.getGameDetail(id);  // Obtiene detalles de juego
    } else {
      throw new Error('Tipo no válido');
    }
  }
}
