import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  movieReviews: any[] = [];  // Para guardar las reseñas de las películas
  errorMessage: string = '';  // Para mostrar mensajes de error en caso de fallo
  apiKey: string = 'YOUR_API_KEY';  // Reemplaza con tu clave de API de Rotten Tomatoes

  constructor(private http: HttpClient, private navCtrl: NavController) { }

  ngOnInit() {
    this.getMovieReviews();  // Llamar a la API cuando el componente se inicializa
  }

  getMovieReviews() {
    // Aquí debes colocar la URL correcta de la API con los parámetros adecuados
    const url = `httpsapi.rottentomatoes.com/api/public/v1.0/movie_alias.json?id=<>&type=<>`;

    // Llamada HTTP GET a la API
    this.http.get(url).subscribe(
      (response: any) => {
        this.movieReviews = response.reviews;  // Guarda las reseñas obtenidas
        console.log(this.movieReviews);  // Mostrar las reseñas en consola
      },
      (error) => {
        this.errorMessage = 'No se pudieron obtener las reseñas. Intenta nuevamente más tarde.';
        console.error('Error al obtener reseñas:', error);  // Mostrar el error en consola
      }
    );
  }

  goBack() {
    this.navCtrl.back();  // Regresa a la pantalla anterior
  }
}
