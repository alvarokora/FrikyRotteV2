import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { movieAPI } from 'src/managers/movieAPI';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  movieReviews: any[] = [];  // Para guardar las reseñas de las películas
  errorMessage: string = '';  // Para mostrar mensajes de error en caso de fallo
  apiKey: string = 'YOUR_API_KEY';  // Reemplaza con tu clave de API de Rotten Tomatoes

  constructor(private http: HttpClient, private navCtrl: NavController, private movieApi: movieAPI) { }

  async ngOnInit() {
    this.loadMovies()
  }

  loadMovies(){
    this.movieApi.getAlias().subscribe(
      (Response) => {
        console.log('Peliculas obtenidas: ',Response);
      },
      (Error) => {
        console.error('Error al obtener peliculas: ',Error);
      }
    );
  }

  goBack() {
    this.navCtrl.back();  // Regresa a la pantalla anterior
  }
}
