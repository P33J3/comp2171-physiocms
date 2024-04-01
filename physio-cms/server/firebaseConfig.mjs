
import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { config } from 'dotenv';
import * as environment  from '../.environment.mjs';

config();

const app = initializeApp(environment.firebaseConfig);
const db = getFirestore(app);
export const clientsRef = collection(db, 'Clients');
export const calendarRef = collection(db, 'calendar');
 // module.exports = clientsRef;




