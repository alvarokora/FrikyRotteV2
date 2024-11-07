import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
    providedIn: 'root',
})
export class UserRegistrationUseCase {

    constructor(
        private fireAuth: AngularFireAuth,
        private db: AngularFireDatabase
    ) { }

    async performRegistration(email: string, password: string): Promise<{ success: boolean; message: string }> {
        try {
            // Registra al usuario en Firebase Authentication
            const userCredential = await this.fireAuth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            if (user) {
                // Obtén el UID, el nombre de usuario y la URL de la foto de perfil (si existen)
                const uid = user.uid;
                const displayName = user.displayName || '';  // Si no hay nombre, guarda un string vacío
                const photoURL = user.photoURL || '';  // Si no hay URL de imagen, guarda un string vacío

                // Crear objeto con los datos del usuario
                const userData = {
                    uid: uid,
                    email: email,
                    displayName: displayName,
                    photoURL: photoURL
                };

                // Guarda la información del usuario en Realtime Database
                await this.db.object(`/users/${uid}`).set(userData);
            }

            // Devuelve true si fue exitoso, con un mensaje
            return { success: true, message: "Usuario registrado con éxito" };

        } catch (error: any) {
            // Manejo de errores basado en el código de Firebase
            let errorMessage = 'Ocurrió un error al registrar el usuario';

            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Este correo electrónico ya está en uso. Por favor, utiliza otro o inicia sesión.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'La dirección de correo electrónico no es válida.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'La contraseña es muy débil.';
                    break;
                default:
                    errorMessage += ': ' + error.message;
                    break;
            }

            // Devuelve false si hubo un error, junto con el mensaje de error
            return { success: false, message: errorMessage };
        }
    }
}