# Firebase to MongoDB Migration Guide

## Current Situation
- ✅ Your data (46 students, events, bytelogs) is in **Firebase Firestore**
- ✅ Your backend is connected to **MongoDB Atlas** (empty)
- ✅ Admin panel is working but shows 0 because MongoDB is empty

## Solution: Migrate Data from Firebase to MongoDB

### Option 1: Manual Export/Import (Easiest)

#### Step 1: Export from Firebase
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: `bytezen-3a7d0`
3. Go to **Firestore Database**
4. For each collection (`users`, `students`, `events`, `insights`):
   - Click on the collection
   - Click the three dots (⋮) menu
   - Select "Export collection"
   - Save the JSON file

#### Step 2: Use the Migration Script
I've created a migration script at `server/scripts/migrateFromFirebase.js`

**To run it:**

1. Make sure you have Firebase Admin SDK credentials:
   ```bash
   # In server/.env, add:
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"bytezen-3a7d0",...}
   ```

2. Run the migration:
   ```bash
   cd server
   node scripts/migrateFromFirebase.js
   ```

### Option 2: Use Firebase Console Export

#### Export Data:
1. Go to: https://console.firebase.google.com/project/bytezen-3a7d0/firestore
2. Click Settings (gear icon) → Export data
3. Select all collections
4. Export to Google Cloud Storage

#### Import to MongoDB:
Use the exported JSON files with `mongoimport` command

### Option 3: Quick Manual Entry (If Small Dataset)

Since the admin panel is now fully functional, you can manually add:
1. **Students** - Go to Student Management and add students one by one
2. **Events** - Go to Events Management and create events
3. **ByteLogs** - Go to ByteLog Management and create posts

---

## What Collections to Migrate

### 1. **users** → MongoDB `users` collection
Fields to map:
- `uid` → `uid`
- `email` → `email`
- `name` / `displayName` → `name`
- `role` → `role`
- `photoURL` → `photoURL`

### 2. **students** → MongoDB `students` collection
Fields to map:
- `uid` → `uid`
- `name` → `name`
- `email` → `email`
- `rollNumber` → `rollNumber`
- `phone` → `phone`
- `department` → `department`
- `division` → `division`
- `year` → `year`
- `enrolledCourses` → `enrolledCourses`

### 3. **events** → MongoDB `events` collection
Fields to map:
- `title` → `title`
- `description` → `description`
- `date` → `date`
- `time` → `time`
- `location` → `location`
- `eventType` → `eventType`
- `mode` → `mode`
- `images` → `images`
- `isPublished` → `isPublished`

### 4. **insights** → MongoDB `insights` collection
Fields to map:
- `title` → `title`
- `content` → `content`
- `author` → `author`
- `thumbnailUrl` → `thumbnailUrl`
- `tags` → `tags`
- `isPublished` → `isPublished`

---

## Getting Firebase Service Account Key

1. Go to: https://console.firebase.google.com/project/bytezen-3a7d0/settings/serviceaccounts/adminsdk
2. Click "Generate new private key"
3. Download the JSON file
4. Copy the entire JSON content
5. Add to `server/.env`:
   ```
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"bytezen-3a7d0",...entire JSON here...}
   ```

---

## After Migration

1. **Verify Data**
   - Check MongoDB Atlas to see if collections have data
   - Or run: `node scripts/checkData.js`

2. **Refresh Admin Dashboard**
   - The dashboard will now show correct counts
   - All admin panels will display real data

3. **Test CRUD Operations**
   - Try adding a new event
   - Try editing a student
   - Try deleting a bytelog

---

## Need Help?

If you need help with the migration:
1. Share your Firebase export files
2. Or provide Firebase Admin SDK credentials
3. I can help create a custom migration script

---

## Alternative: Keep Using Firebase

If you prefer to keep using Firebase instead of MongoDB:
- We would need to rewrite all backend controllers
- Change from MongoDB models to Firebase queries
- This is more work than migrating the data
- **Not recommended** since we already built MongoDB integration
