import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MovieModel } from "src/app/model/MovieModel";

@Injectable({providedIn: 'root'})

export class MoviesService{
    apiUrl = "https://api.themoviedb.org/3";
    apiKey = "7193c40a0550f4af72011ea24f8b7777";

    constructor(private http: HttpClient){}

    getPopularMovies(): Observable<MovieModel[]>{
        return this.http.get<MovieModel[]>(`${this.apiUrl}/movie/popular?api_key=${this.apiKey}`);
    }
}