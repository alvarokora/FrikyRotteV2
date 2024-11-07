import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class movieAPI {
    private baseURL = environment.apiBaseUrl;
    private endPoint = environment.apiEndpoints;

    constructor(private http: HttpClient){}

    getAlias(){
        const url = `${this.baseURL}${this.endPoint.movie_alias}`;
        return this.http.get(url);
    }
}