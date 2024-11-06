import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/managers/StorageService';
import { CancelAlertService } from 'src/managers/CancelAlertService';
import { NavController} from '@ionic/angular';
import { UserLogoutUseCase } from 'src/app/use-cases/user-logout.user-case';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  email: string = ''; // Aquí almacenamos el correo recibido

  constructor(private storageService: StorageService,
    private router: Router,
    private alert: CancelAlertService,
    private navCtrl: NavController,
    private userLogoutUseCase: UserLogoutUseCase) { }

  async ngOnInit() {
    const user = await this.storageService.get('user');
    if (user) {
      this.email = user.email && user.email.trim() !== '' ? user.email : 'Correo no disponible';
    }
  }

  goBack() {
    this.navCtrl.back();
  }

  async onLogoutButtonPressed() {
    const result = await this.userLogoutUseCase.performLogout();
    if (result.success){
      await this.storageService.set('isSessionActive', false);
      this.alert.showAlert(
        'Sesion cerrada',
        'La sesion a sido cerrada de manera correcta.',
        () =>{
          this.navCtrl.navigateRoot('/login');
        }
      )
    } else {
      this.alert.showAlert(
        'Error',
        result.message,
        () =>{
          // Depende
        }
      );
    }
  }
}
