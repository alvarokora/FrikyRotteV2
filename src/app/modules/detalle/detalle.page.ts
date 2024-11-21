import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { MoviesService } from 'src/services/movies.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  movieReviews = [];  // Para guardar las reseñas de las películas

  constructor(private http: HttpClient, private navCtrl: NavController, private movieService: MoviesService) { }

  async ngOnInit() {
    this.movieService.getPopularMovies().subscribe(data => this.movieReviews=data);
  }

  goBack() {
    this.navCtrl.back();  // Regresa a la pantalla anterior
  }
}
