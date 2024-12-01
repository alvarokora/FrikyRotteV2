import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
  export class JikanManager {
    private BASE_URL = 'https://api.jikan.moe/v4';
  
    constructor(private http: HttpClient) {}
  
    getPopularAnimes(page: number = 1): Observable<any> {
      return this.http.get(`${this.BASE_URL}/anime?order_by=popularity&page=${page}`);
    }
  
    getAnimeDetail(id: number): Observable<any> {
      return this.http.get(`${this.BASE_URL}/anime/${id}`);
    }
  }
  