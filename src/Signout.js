import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from './firebase-config';
export const signOut = () => {
    return firebaseSignOut(auth);
};