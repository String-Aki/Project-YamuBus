import admin from 'firebase-admin';
import fs from 'fs';

const keyPath = new URL('../serviceAccountKey.json', import.meta.url);

try {
    const serviceAccount = JSON.parse(fs.readFileSync(keyPath,'utf8'));
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (error) {
    console.error('Error initializing firebase Admin SDK:', error);
    process.exit(1);
}

export default admin;