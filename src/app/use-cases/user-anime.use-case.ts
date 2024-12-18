import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { StorageService } from "src/managers/StorageService";
import { UserCrudService } from "src/managers/user-crud-service";
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
    providedIn: 'root',
})
export class UserAnimeUseCase {

    constructor(
        private fireAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private storageService: StorageService,
        private userCrudService: UserCrudService
    ) {}

    async performAddAnime(id: number, uid: string): Promise<{ success: boolean; message: string }>{
        console.log('ID: ',id);
        console.log('uid: ',uid);
        
        try {
            // Obtener la ubicación del usuario
            const position = await Geolocation.getCurrentPosition();
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log('Ubicación obtenida:', { latitude, longitude });

            const AnimeData = {
                uid,
                id,
                location: {
                    latitude,
                    longitude,
                  
                }
            };

            console.log('Datos: ',AnimeData);

            await this.db.object(`/anime/${uid+id}`).set(AnimeData);

            return {success: true, message: "Anime agregado con éxito"};
        } catch (error: any) {
            let errorMessage = 'Ocurrió un error al agregar un Anime a Firebase';
            console.error('Error al agregar un Anime a Firebase:', error);
            return { success: false, message: errorMessage };
        }
    }

    async performDeleteAnime(id: number, uid: string): Promise<{ success: boolean; message: string}>{
        try{
            console.log('ID: ',id);
            await this.db.object(`/anime/${uid+id}`).remove();
            return { success: true, message: "Anime eliminado con exito"};
        } catch (error: any) {
            let errorMessage = 'Ocurrio un error al eliminar el Anime de FireBase';
            console.error('Error al eliminar el anime en FireBase: ',error);
            return { success: false, message: errorMessage};
        }
    }

    async performAddComment(id: number, uid: string, comment: string): Promise<{success: boolean; message: string}>{
        try{
            const AnimeData = {
                uid: uid,
                id: id,
                comment: comment
            };
            console.log('Datos: ',AnimeData);
            await this.db.object(`/anime/${uid+id}`).update(AnimeData);
            return { success: true, message: "Anime actualizado con exito"};
        } catch (error: any){
            let errorMessage = "Ocurrio un error al actualizar el anime de Firebase";
            console.error("Error al actualizar el anime en FireBase");
            return { success: false, message: errorMessage};
        }
    }

    async performGetComment(id: number, uid: string): Promise<{ success: boolean; comment: string | null; message: string }> {
        try {
            // Acceder a la ruta correcta en la base de datos para obtener el comentario
            const commentSnapshot = await this.db.object(`/anime/${uid + id}`).query.once('value');

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
    async performGetCoordinatesAnime(id: number, uid: string): Promise<{ success: boolean; coordinates: { latitude: number | null, longitude: number | null } | null; message: string }> {
        try {
            // Acceder a la ruta correcta en la base de datos para obtener las coordenadas
            const coordinatesSnapshot = await this.db.object(`/coordinates/anime/${uid + id}`).query.once('value');
      
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