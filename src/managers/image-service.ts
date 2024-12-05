import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { StorageService } from 'src/managers/StorageService';

@Injectable({
    providedIn: 'root',
})
export class ImageService {

    constructor(private db: AngularFireDatabase, private storageService: StorageService) { }

    async getImageFromCamera(): Promise<{ success: boolean, message: string, imageUrl?: string }> {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Camera,
            });

            const imageUrl = image.dataUrl;
            return await this.saveImage(imageUrl);
        } catch (error) {
            return { success: false, message: 'Error al obtener la imagen de la cámara.' };
        }
    }

    async getImageFromGallery(): Promise<{ success: boolean, message: string, imageUrl?: string }> {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Photos,
            });

            const imageUrl = image.dataUrl;
            console.log(imageUrl);
            return await this.saveImage(imageUrl);
        } catch (error) {
            return { success: false, message: 'Error al obtener la imagen de la galería.' };
        }
    }

    private async saveImage(imageUrl: string): Promise<{ success: boolean, message: string, imageUrl?: string }> {
        try {
            // Obtén el usuario almacenado localmente
            const user = await this.storageService.get('user');

            if (user && user.uid) {
                const uid = user.uid;

                // Guarda la URL de la imagen en la base de datos en Realtime Database
                await this.db.object(`users/${uid}`).update({ photoURL: imageUrl });

                // Actualiza el campo photoURL en el almacenamiento local
                user.photoURL = imageUrl;
                await this.storageService.set('user', user);

                return { success: true, message: 'Imagen de usuario actualizada con éxito', imageUrl: imageUrl };
            } else {
                return { success: false, message: 'No se encontró el UID del usuario.' };
            }
        } catch (error) {
            return { success: false, message: `Error al guardar la imagen: ${error.message}` };
        }
    }
}
