import { Injectable } from '@angular/core';

//imports firebase
import firebase from 'firebase/compat';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})

export class SessionManager {

    constructor(public fireAuth: AngularFireAuth) { }

    async signOut() {
        return await this.fireAuth.signOut()
    }

    async loginWith(email: string, password: string) : Promise<any> {
        return await this.fireAuth.signInWithEmailAndPassword(email, password)
    }

    async resetPassword(email: string) {
        return await this.fireAuth.sendPasswordResetEmail(email)
    }

    async getProfile() {
        return await this.fireAuth.currentUser
    }
}