import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetallesService } from '../../managers/detalles.services';

@Component({
  selector: 'app-detalles-modal',
  templateUrl: './detalles-modal.component.html',
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
      let idToUse = this.id;  // Asumimos el ID por defecto
  
      // Si el tipo es "anime", usamos mal_id en lugar de id
      if (this.tipo === 'anime') {
        idToUse = this.detalle.mal_id; // Usamos mal_id, y si no está disponible, usamos el id original
      }
  
      this.detallesService.getDetalle(idToUse, this.tipo).subscribe((data) => {
        this.detalle = data;
        console.log('Detalles recibidos:', this.detalle);  // Verifica los datos en la consola
  
        // El resto de la lógica permanece igual
        if (this.tipo === 'game') {
          this.detalle.vote_average = this.detalle.vote_average || 'N/A';
          this.detalle.genres = this.detalle.genres?.map((genre: any) => genre.name).join(', ') || 'N/A';
          this.detalle.description = this.getLocalizedDescription(this.detalle);
          this.detalle.name = this.detalle.name || 'Nombre no disponible';
          this.detalle.release_date = this.detalle.released || 'Fecha no disponible';
        }
  
        if (this.tipo === 'movie') {
          this.detalle.vote_average = this.detalle.vote_average || 'N/A';
          this.detalle.genres = this.detalle.genres?.map((genre: any) => genre.name).join(', ') || 'N/A';
          this.detalle.overview = this.detalle.overview || 'Sinopsis no disponible';
          this.detalle.release_date = this.detalle.release_date || 'Fecha no disponible';
          this.detalle.title = this.detalle.title || 'Título no disponible';
        }
  
        if (this.tipo === 'anime') {
          this.detalle.synopsis = this.detalle.synopsis || this.detalle.overview || 'Sinopsis no disponible';
          this.detalle.first_air_date = this.detalle.first_air_date || 'Fecha no disponible';
          this.detalle.genres = this.detalle.genres?.map((genre: any) => genre.name).join(', ') || 'N/A';
          this.detalle.title = this.detalle.title || 'Título no disponible';
        }
      });
    }
  }
  
  

  // Método para obtener la descripción localizada (en inglés o español)
  getLocalizedDescription(detalle: any): string {
    let description = '';

    if (detalle.about) {
      description = detalle.about;
    } else if (detalle.description) {
      description = detalle.description;
    } else if (detalle.overview) {
      description = detalle.overview;
    }

    const firstParagraph = description.split('\n')[0];  // Obtener solo el primer párrafo
    return this.stripHtml(firstParagraph);  // Eliminar etiquetas HTML
  }

  // Método para eliminar las etiquetas HTML de la descripción
  stripHtml(str: string): string {
    return str.replace(/<[^>]*>/g, ''); // Elimina cualquier etiqueta HTML
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
