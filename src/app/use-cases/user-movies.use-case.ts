import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { StorageService } from "src/managers/StorageService";
import { UserCrudService } from "src/managers/user-crud-service";

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
        
        try{
            const MovieData = {
                uid: uid,
                id: id
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

}