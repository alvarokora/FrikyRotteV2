import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  email: string = ''; // Aquí almacenamos el correo recibido

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // Obtiene el parámetro 'email' de los queryParams
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || ''; // Guarda el correo
      console.log('Email received in Home:', this.email); // Verifica que el correo se está recibiendo
    });
  }

  onIconButtonClick() {
    // Redirige al usuario a la página de usuario y pasa el parámetro email
    this.router.navigate(['/usuario'], { queryParams: { email: this.email } });
  }

  onIconHomeButtonClick(){
    this.router.navigate(['/detalle']);
  }
}
