import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MovieModel } from "src/app/model/MovieModel";

@Injectable({providedIn: 'root'})

export class MoviesService{
    
    /*
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTkzYzQwYTA1NTBmNGFmNzIwMTFlYTI0ZjhiNzc3NyIsIm5iZiI6MTczMjE5NzQ0Ny4xOTYwOTI0LCJzdWIiOiI2NzNlODg2NjIxZGE0Mjk2N2ZjNDgyMzkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.rRc6EeTGcpsJcee4wGilduVnXBtQmu_44AsQWp62uO8'
        }
      };
      
      fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', options)
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.error(err));
        */

    apiUrl = "https://api.themoviedb.org/3";
    apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTkzYzQwYTA1NTBmNGFmNzIwMTFlYTI0ZjhiNzc3NyIsIm5iZiI6MTczMjE5NzQ0Ny4xOTYwOTI0LCJzdWIiOiI2NzNlODg2NjIxZGE0Mjk2N2ZjNDgyMzkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.rRc6EeTGcpsJcee4wGilduVnXBtQmu_44AsQWp62uO8";

    constructor(private http: HttpClient){}

    getPopularMovies(): Observable<MovieModel[]>{
        return this.http.get<MovieModel[]>(`${this.apiUrl}/trending/movie/day?language=en-USapi_key=${this.apiKey}`);
    }

}