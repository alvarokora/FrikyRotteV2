import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SessionGuard } from '../app/session.guard'; // Asegúrate de ajustar la ruta según tu estructura de carpetas

const routes: Routes = [
  {
    path: 'splash',
    loadChildren: () => import('./modules/splash/splash.module').then(m => m.SplashPageModule)
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomePageModule),
    canActivate: [SessionGuard] // Aplica el guard aquí
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./modules/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'usuario',
    loadChildren: () => import('./modules/usuario/usuario.module').then(m => m.UsuarioPageModule),
    canActivate: [SessionGuard] // Protege la ruta de usuario también
  },
  {
    path: 'detalle',
    loadChildren: () => import('./modules/detalle/detalle.module').then(m => m.DetallePageModule),
    canActivate: [SessionGuard] // Protege la ruta de detalle
  },
  {
    path: '**',
    redirectTo: 'splash' // Ruta comodín para redirigir cualquier ruta desconocida a la página de splash
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
