import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class JikanManager {
  private BASE_URL = 'https://api.jikan.moe/v4';

  constructor(private http: HttpClient) {}

  getPopularAnimes(page: number = 1): Observable<any> {
    const url = `${this.BASE_URL}/anime?order_by=popularity&page=${page}`;
    return this.http.get<any>(url).pipe(
      map((response: any) => {
        // Eliminar el filtro por mal_id
        const sortedAnimes = response.data.sort((a: any, b: any) => b.popularity - a.popularity);
        return { ...response, data: sortedAnimes };
      })
    );
  }
  
  searchAnimes(query: string): Observable<any> {
    return this.getPopularAnimes().pipe(
      map((response: any) => {
        let filteredData = response.data.filter((anime: any) =>
          anime.status === 'Currently Airing' || anime.status === 'Finished Airing'
        );
  
        const lowerQuery = query.toLowerCase();
  
        // Filtrar por títulos que comiencen con letras (ignorar caracteres especiales)
        filteredData = filteredData.filter((anime: any) => {
          const title = (anime.title_english || anime.title).toLowerCase();
          return /^[a-z]/.test(title); // Solo títulos que comienzan con letras
        });
  
        // Ordenar por coincidencia con el término de búsqueda
        filteredData = filteredData.sort((a: any, b: any) => {
          const aTitle = (a.title_english || a.title).toLowerCase();
          const bTitle = (b.title_english || b.title).toLowerCase();
  
          // Priorizar coincidencia exacta
          if (aTitle === lowerQuery && bTitle !== lowerQuery) return -1;
          if (bTitle === lowerQuery && aTitle !== lowerQuery) return 1;
  
          // Priorizar coincidencias parciales y alfabéticas
          const aIncludes = aTitle.includes(lowerQuery);
          const bIncludes = bTitle.includes(lowerQuery);
  
          if (aIncludes && !bIncludes) return -1;
          if (!aIncludes && bIncludes) return 1;
  
          // Fallback a orden alfabético
          return aTitle.localeCompare(bTitle);
        });
  
        return { ...response, data: filteredData };
      })
    );
  }
  
  
  getAnimeDetail(id: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/anime/${id}`);
  }
}
