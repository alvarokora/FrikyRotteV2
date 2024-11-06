import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { StorageService } from 'src/managers/StorageService';

@Injectable({
    providedIn: 'root',
})
export class UserLogoutUseCase {

    constructor(
        private fireAuth: AngularFireAuth,
        private storageService: StorageService
    ) { }

    async performLogout(): Promise<{ success: boolean; message: string }> {
        try {
            // Sign out from Firebase
            await this.fireAuth.signOut();

            // Clear all data from Ionic Storage
            await this.storageService.clear();

            return { success: true, message: "Sesión finalizada en firebase y usuario eliminado de Ionic Storage" };
        } catch (error: any) {
            let errorMessage = 'No se pudo cerrar sesión en firebase';

            if (error.message) {
                errorMessage += ': ' + error.message;
            }

            return { success: false, message: errorMessage };
        }
    }
}