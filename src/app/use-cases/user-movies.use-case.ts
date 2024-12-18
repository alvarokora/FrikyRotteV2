import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { StorageService } from "src/managers/StorageService";
import { UserCrudService } from "src/managers/user-crud-service";
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
    providedIn: 'root',
})
export class UserMoviesUseCase {

    constructor(
        private fireAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private storageService: StorageService,
        private userCrudService: UserCrudService
    ) {}

    async performAddMovie(id: number, uid: string): Promise<{ success: boolean; message: string }>{
        console.log('ID: ',id);
        console.log('uid: ',uid);
        
        try {
            // Obtener ubicación actual
            const coordinates = await Geolocation.getCurrentPosition();
            const latitude = coordinates.coords.latitude;
            const longitude = coordinates.coords.longitude;
    
            const MovieData = {
                uid: uid,
                id: id,
                latitude: latitude,
                longitude: longitude
            };

            console.log('Datos: ',MovieData);

            await this.db.object(`/movies/${uid+id}`).set(MovieData);

            return {success: true, message: "Pelicula agregada con éxito"};
        } catch (error: any) {
            let errorMessage = 'Ocurrió un error al agregar la pelicula a Firebase';
            console.error('Error al agregar la película a Firebase:', error);
            return { success: false, message: errorMessage };
        }
    }

    async performDeleteMovie(id: number, uid: string): Promise<{ success: boolean; message: string}>{
        try{
            await this.db.object(`/movies/${uid+id}`).remove();
            return { success: true, message: "Pelicula eliminada con exito"};
        } catch (error: any) {
            let errorMessage = 'Ocurrio un error al eliminar la pelicula de FireBase';
            console.error('Error al eliminar la pelicula en FireBase: ',error);
            return { success: false, message: errorMessage};
        }
    }

    async performAddComment(id: number, uid: string, comment: string): Promise<{success: boolean; message: string}>{
        try{
            const MovieData = {
                uid: uid,
                id: id,
                comment: comment
            };
            console.log('Datos: ',MovieData);
            await this.db.object(`/movies/${uid+id}`).update(MovieData);
            return { success: true, message: "Pelicula actualizada con exito"};
        } catch (error: any){
            let errorMessage = "Ocurrio un error al actualizar la pelicula de Firebase";
            console.error("Error al actualizar la pelicula en FireBase");
            return { success: false, message: errorMessage};
        }
    }

    async performGetComment(id: number, uid: string): Promise<{ success: boolean; comment: string | null; message: string }> {
        try {
            // Acceder a la ruta correcta en la base de datos para obtener el comentario
            const commentSnapshot = await this.db.object(`/movies/${uid + id}`).query.once('value');

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

    async performGetCoordinatesMovie(id: number, uid: string): Promise<{ success: boolean; coordinates: { latitude: number | null, longitude: number | null } | null; message: string }> {
        try {
            // Acceder a la ruta correcta en la base de datos para obtener las coordenadas
            const coordinatesSnapshot = await this.db.object(`/coordinates/movie/${uid + id}`).query.once('value');
            
            // Verificar si hay datos
            const coordinates = coordinatesSnapshot.val();
            if (!coordinates) {
                return { 
                    success: false, 
                    coordinates: null, 
                    message: "Coordenadas no encontradas" 
                };
            }
    
            // Extraer latitud y longitud
            const latitude = coordinates.latitude ?? null;
            const longitude = coordinates.longitude ?? null;
    
            // Verificar si las coordenadas están presentes
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
                    message: "Coordenadas incompletas" 
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