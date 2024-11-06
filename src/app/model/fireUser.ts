export interface fireUser {
    uid: string;
    email: string | null;
    emailVerified: boolean;
    displayName: string | null;
    photoURL: string | null;
    phoneNumber: string | null;
    providerId: string;
    creationTime: string | undefined;
    lastSignInTime: string | undefined;
}