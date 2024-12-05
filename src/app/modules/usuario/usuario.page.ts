import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/managers/StorageService';
import { CancelAlertService } from 'src/managers/CancelAlertService';
import { NavController } from '@ionic/angular';
import { UserLogoutUseCase } from 'src/app/use-cases/user-logout.user-case';
import { Router } from '@angular/router';
import { ImageService } from 'src/managers/image-service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  email: string = ''; // Aquí almacenamos el correo recibido
  imageUrl: string = '';
  country: string = ''; // Aquí almacenamos el país obtenido
  countryFlag: string = ''; // Aquí almacenamos la URL de la bandera

  constructor(private storageService: StorageService,
              private router: Router,
              private alert: CancelAlertService,
              private navCtrl: NavController,
              private userLogoutUseCase: UserLogoutUseCase,
              private imageService: ImageService) { }

  async ngOnInit() {
    const user = await this.storageService.get('user');
    if (user) {
      this.email = user.email && user.email.trim() !== '' ? user.email : 'Correo no disponible';
      this.imageUrl = user.photoURL || '';
    }

    // Llamar a la función para obtener la ubicación
    await this.getLocation();
  }

  // Método para obtener la ubicación, el país y la bandera
  async getLocation() {
    try {
      // Obtener la posición actual
      const coordinates = await Geolocation.getCurrentPosition();
      const latitude = coordinates.coords.latitude;
      const longitude = coordinates.coords.longitude;
  
      // Imprimir las coordenadas en la consola para asegurarse de que sean correctas
      console.log('Coordenadas obtenidas:', latitude, longitude);
  
      // Llamar al servicio de geolocalización inversa
      const response = await fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json`);
      const data = await response.json();
  
      // Verificar si se obtuvo un país y, si no, mostrar un mensaje
      if (data.country) {
        this.country = data.country;
        // Llamar a la API de países para obtener la bandera
        const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${data.country}?fullText=true`);
        const countryData = await countryResponse.json();
        this.countryFlag = countryData[0]?.flags?.svg || '';
      } else {
        this.country = 'No se pudo determinar el país';
        this.countryFlag = '';
      }
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      this.country = 'Error al obtener el país';
      this.countryFlag = '';
    }
  }
  

  goBack() {
    this.navCtrl.back();
  }

  async onLogoutButtonPressed() {
    const result = await this.userLogoutUseCase.performLogout();
    if (result.success) {
      await this.storageService.set('isSessionActive', false);
      this.alert.showAlert(
        'Sesion cerrada',
        'La sesion a sido cerrada de manera correcta.',
        () => {
          this.navCtrl.navigateRoot('/login');
        }
      );
    } else {
      this.alert.showAlert(
        'Error',
        result.message,
        () => {
          // Depende
        }
      );
    }
  }

  async takeProfilePhoto() {
    const result = await this.imageService.getImageFromCamera();
    if(result.success) {
      this.imageUrl = result.imageUrl;
    } else {
      console.error(result.message);
    }
  }

  async chooseProfilePhoto() {
    const result = await this.imageService.getImageFromGallery();
    if(result.success) {
      this.imageUrl = result.imageUrl;
    } else {
      console.error(result.message);
    }
  }
}