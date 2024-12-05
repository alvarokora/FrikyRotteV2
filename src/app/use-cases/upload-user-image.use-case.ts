import { Injectable } from "@angular/core";
import { StorageService } from "src/managers/StorageService";
import { AngularFireDatabase } from "@angular/fire/compat/database";

@Injectable({
    providedIn: 'root',
})
export class UploadUserImageUseCase{

    constructor(
        private storageService: StorageService,
        private db: AngularFireDatabase
    ){}

    async UploadUserImage(imageUrl: String): Promise <{ success: boolean, message: string}> {
        try{
            const user = await this.storageService.get('user');

            if (user && user.uid){
                const uid = user.uid;
                await this.db.object(`users/${uid}`).update({ photoURL: imageUrl });
                user.photoURL = imageUrl;
                await this.storageService.set('user', user);
                await this.storageService.set('UserPhotoURL', imageUrl);
                return { success: true, message: 'Imagen de usuario actualizada con éxito.' };
            } else {
                return { success: false, message: 'No se encontro el UID del usuario'};
            }
        } catch(error){
            return { success: false, message: `Error al subir la imagen: ${error.message}`};
        }
    }
}