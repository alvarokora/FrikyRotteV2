import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginUseCase } from 'src/app/use-cases/user-login.use-case';
import { CancelAlertService } from 'src/managers/CancelAlertService';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private alert: CancelAlertService, private userLoginUseCase: UserLoginUseCase) { }

  ngOnInit() { }

  async onLoginButtonPressed() {

    const result = await this.userLoginUseCase.performLogin(this.email,this.password);

    if(result.success){
      this.alert.showAlert(
        'Login exitoso',
        'Has iniciado sesion correctamente.',
        () => {
          this.router.navigate(['/home']);
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

  onRegisterButtonPressed() {
    this.router.navigate(['/register']);
  }
}
