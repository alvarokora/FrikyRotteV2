import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { StorageService } from "src/managers/StorageService";
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
    providedIn: 'root',
})
export class UserGamesUseCase {

    constructor(
        private fireAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private storageService: StorageService
    ) { }

    async performAddGame(id: number, uid: string): Promise<{ success: boolean; message: string }> {
        console.log('ID: ', id);
        console.log('uid: ', uid);
        
        try {
            // Obtener la ubicación del usuario
            const position = await Geolocation.getCurrentPosition();
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log('Ubicación obtenida:', { latitude, longitude });

            const GameData = {
                uid,
                id,
                location: {
                    latitude,
                    longitude,
                }
            };

            console.log('Datos: ', GameData);

            await this.db.object(`/games/${uid + id}`).set(GameData);

            return { success: true, message: "Juego agregado con éxito" };
        } catch (error: any) {
            let errorMessage = 'Ocurrió un error al agregar el juego a Firebase';
            console.error('Error al agregar el juego a Firebase:', error);
            return { success: false, message: errorMessage };
        }
    }

    async performDeleteGame(id: number, uid: string): Promise<{ success: boolean; message: string }> {
        try {
            await this.db.object(`/games/${uid + id}`).remove();
            return { success: true, message: "Juego eliminado con exito" };
        } catch (error: any) {
            let errorMessage = 'Ocurrio un error al eliminar el juego de FireBase';
            console.error('Error al eliminar el juego en FireBase: ', error);
            return { success: false, message: errorMessage };
        }
    }

    async performAddComment(id: number, uid: string, comment: string): Promise<{ success: boolean; message: string }> {
        try {
            const GameData = {
                uid: uid,
                id: id,
                comment: comment
            };
            console.log('Datos: ', GameData);
            await this.db.object(`/games/${uid + id}`).update(GameData);
            return { success: true, message: "Juego actualizado con exito" };
        } catch (error: any) {
            let errorMessage = "Ocurrio un error al actualizar el juego de Firebase";
            console.error("Error al actualizar el juego en FireBase");
            return { success: false, message: errorMessage };
        }
    }

    async performGetComment(id: number, uid: string): Promise<{ success: boolean; comment: string | null; message: string }> {
        try {
            // Acceder a la ruta correcta en la base de datos para obtener el comentario
            const commentSnapshot = await this.db.object(`/games/${uid + id}`).query.once('value');

            // Imprimir los datos obtenidos para verificar su estructura
            console.log('Datos obtenidos:', commentSnapshot.val());

            // Comprobamos si el comentario existe
            const comment = commentSnapshot.val() && commentSnapshot.val().comment ? commentSnapshot.val().comment : null;

            // Si el comentario existe, lo devolvemos
            if (comment !== null) {
                return { success: true, comment: comment, message: "Comentario obtenido con éxito" };
            } else {
                return { success: false, comment: null, message: "Comentario no encontrado" };
            }
        } catch (error: any) {
            console.error("Error al obtener el comentario:", error);
            return { success: false, comment: null, message: "Error al obtener el comentario" };
        }
    }
    async performGetCoordinatesGame(id: number, uid: string): Promise<{ success: boolean; coordinates: { latitude: number | null, longitude: number | null } | null; message: string }> {
        try {
            // Acceder a la ruta correcta en la base de datos para obtener las coordenadas
            const coordinatesSnapshot = await this.db.object(`/coordinates/game/${uid + id}`).query.once('value');
      
            // Imprimir los datos obtenidos para verificar su estructura
            console.log('Datos obtenidos:', coordinatesSnapshot.val());
      
            // Comprobamos si las coordenadas existen
            const coordinates = coordinatesSnapshot.val();
            const latitude = coordinates ? coordinates.latitude : null;
            const longitude = coordinates ? coordinates.longitude : null;
      
            // Si las coordenadas existen, las devolvemos
            if (latitude !== null && longitude !== null) {
                return { 
                    success: true, 
                    coordinates: { latitude, longitude }, 
                    message: "Coordenadas obtenidas con éxito"
                };
            } else {    
                return { 
                    success: false, 
                    coordinates: null, 
                    message: "Coordenadas no encontradas"
                };
            }
        } catch (error: any) {
            console.error("Error al obtener las coordenadas:", error);
            return { 
                success: false, 
                coordinates: null, 
                message: "Error al obtener las coordenadas"
            };
        }
    }
    


}