import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
// You'll need to download your service account key from Firebase Console
// and save it as serviceAccountKey.json in the server directory

try {
  const serviceAccount = JSON.parse(
    readFileSync(join(__dirname, '../serviceAccountKey.json'), 'utf8')
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const db = admin.firestore();

  // User roles configuration
  const userRoles = {
    // Admin and Instructor
    'muntazir.23bap1194@dcac.du.ac.in': ['admin', 'instructor'],
    'tushar.23bap1187@dcac.du.ac.in': ['admin', 'instructor'],
    
    // Instructor only
    'mehul.23bap1233@dcac.du.ac.in': ['instructor'],
    'keshav.23bap1198@dcac.du.ac.in': ['instructor'],
    
    // Admin only
    'sahil.23bap1229@dcac.du.ac.in': ['admin']
  };

  async function updateUserRoles() {
    console.log('Starting user role updates...\n');

    for (const [email, roles] of Object.entries(userRoles)) {
      try {
        // Get user by email
        const userRecord = await admin.auth().getUserByEmail(email);
        const uid = userRecord.uid;

        // Determine primary role (admin takes precedence)
        const primaryRole = roles.includes('admin') ? 'admin' : roles[0];

        // Update Firestore document
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          await userRef.update({
            role: primaryRole,
            roles: roles,
            updatedAt: new Date().toISOString()
          });
          console.log(`✅ Updated ${email} -> Role: ${primaryRole}, Roles: [${roles.join(', ')}]`);
        } else {
          // Create user document if it doesn't exist
          await userRef.set({
            userId: uid,
            email: email,
            role: primaryRole,
            roles: roles,
            name: email.split('@')[0].split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' '),
            enrolledCourses: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          console.log(`✅ Created and updated ${email} -> Role: ${primaryRole}, Roles: [${roles.join(', ')}]`);
        }

        // Set custom claims for role-based access
        await admin.auth().setCustomUserClaims(uid, { 
          role: primaryRole,
          roles: roles 
        });
        console.log(`   Set custom claims for ${email}\n`);

      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          console.log(`❌ User not found: ${email} - Please ensure they have registered first\n`);
        } else {
          console.log(`❌ Error updating ${email}:`, error.message, '\n');
        }
      }
    }

    console.log('Role update process completed!');
    process.exit(0);
  }

  updateUserRoles();

} catch (error) {
  console.error('Error initializing Firebase Admin:', error.message);
  console.log('\nPlease ensure you have:');
  console.log('1. Downloaded your Firebase service account key');
  console.log('2. Saved it as serviceAccountKey.json in the server directory');
  console.log('3. Get it from: Firebase Console > Project Settings > Service Accounts > Generate New Private Key');
  process.exit(1);
}
