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
      return this.http.get(`${this.BASE_URL}/anime?order_by=popularity&page=${page}`).pipe(
        map((response: any) => {
          response.data = response.data.map((anime: any) => ({
            ...anime,
            title: anime.title_english || anime.title, // Priorizar título en inglés
          }));
          return response;
        })
      );
    }
    
    searchAnimes(query: string): Observable<any> {
      return this.http.get(`${this.BASE_URL}/anime?q=${query}&order_by=title`);
    }
    
    getAnimeDetail(id: number): Observable<any> {
      return this.http.get(`${this.BASE_URL}/anime/${id}`);
    }
  }
  