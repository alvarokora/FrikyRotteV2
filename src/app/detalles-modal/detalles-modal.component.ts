import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetallesService } from '../../managers/detalles.services';

@Component({
  selector: 'app-detalles-modal',
  templateUrl: './detalles-modal.component.html',
  //styleUrls: ['./detalles-modal-component.scss'],//
})
export class DetallesModalComponent implements OnInit {
  @Input() id: number;  // ID del objeto
  @Input() tipo: 'anime' | 'movie' | 'game';  // Tipo de objeto
  detalle: any;  // Almacena los detalles del objeto

  constructor(
    private modalController: ModalController,
    private detallesService: DetallesService
  ) {}

  ngOnInit() {
    if (this.id && this.tipo) {
      this.detallesService.getDetalle(this.id, this.tipo).subscribe((data) => {
        this.detalle = data;
  
        // Multiplicar la valoración por 2 si es un juego
        if (this.tipo === 'game' && this.detalle.vote_average) {
          this.detalle.vote_average = this.detalle.vote_average * 2;
        }
      });
    }
  }
  
    // Método para construir la URL de la imagen
    getImageUrl(detalle: any): string {
      if (detalle.poster_path) {
        return 'https://image.tmdb.org/t/p/w500/' + detalle.poster_path;
      } else if (detalle.background_image) {
        return detalle.background_image;
      } else if (detalle.images?.jpg?.image_url) {
        return detalle.images.jpg.image_url;
      } else {
        return 'assets/default-image.jpg'; // Imagen por defecto si no se encuentra ninguna
      }
    }
   

  closeModal() {
    this.modalController.dismiss();
  }
}
