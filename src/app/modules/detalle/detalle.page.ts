import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  data: any;

  constructor(private navCtrl: NavController,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.apiService.getData().subscribe(
      (response) => {
        this.data = response;
        console.log(this.data);  // Puedes ver los datos en la consola para asegurarte de que se han recibido correctamente
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

  goBack(){
    this.navCtrl.back();
  }

}
