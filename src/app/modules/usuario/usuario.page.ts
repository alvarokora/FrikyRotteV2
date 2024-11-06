import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SessionManager } from 'src/managers/SessionManager';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {
  email: string = ''; // Aquí almacenamos el correo recibido

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private sessionManager: SessionManager) { }

  ngOnInit() {
    // Obtiene el parámetro 'email' de los queryParams
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || ''; // Guarda el correo
      console.log('Email received in Usuario:', this.email); // Verifica que el correo se está recibiendo
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  async onLogoutButtonPressed() {
    this.navCtrl.navigateRoot('/login'); // Navega a la página de login
  }
}
