import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class GameCrudService {
    private basePath = '/users/games'

    constructor(private db: AngularFireDatabase){}

    createItem(item: any): Promise<void> {
        const id = this.db.createPushId()
        return this.db.object(`${this.basePath}/${id}`).set(item)
    }

    getItems(): Observable<any>{
        return this.db.list(this.basePath).valueChanges()
    }

    deleteItem(id: string): Promise<void>{
        return this.db.object(`${this.basePath}/${id}`).remove();
    }

}