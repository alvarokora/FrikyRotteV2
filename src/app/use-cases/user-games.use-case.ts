import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { StorageService } from "src/managers/StorageService";

@Injectable({
    providedIn: 'root',
})
export class UserGamesUseCase {

    constructor(
        private fireAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private storageService: StorageService
    ) {}

    async performAddGame(id: number, uid: string): Promise<{ success: boolean; message: string }>{
        console.log('ID: ',id);
        console.log('uid: ',uid);
        
        try{
            const GameData = {
                uid: uid,
                id: id
            };

            console.log('Datos: ',GameData);

            await this.db.object(`/games/${uid+id}`).set(GameData);

            return {success: true, message: "Juego agregado con éxito"};
        } catch (error: any) {
            let errorMessage = 'Ocurrió un error al agregar el juego a Firebase';
            console.error('Error al agregar el juego a Firebase:', error);
            return { success: false, message: errorMessage };
        }
    }

    async performDeleteGame(id: number, uid: string): Promise<{ success: boolean; message: string}>{
        try{
            await this.db.object(`/games/${uid+id}`).remove();
            return { success: true, message: "Juego eliminado con exito"};
        } catch (error: any) {
            let errorMessage = 'Ocurrio un error al eliminar el juego de FireBase';
            console.error('Error al eliminar el juego en FireBase: ',error);
            return { success: false, message: errorMessage};
        }
    }

}