# 🚀 Run Full Course Migration

## What This Does

This migration script will:
- ✅ Create 3 courses in Firebase (AI/ML, Data Analytics, MERN Stack)
- ✅ Add sample weeks/modules to each course
- ✅ Add sample lessons (articles) with full content
- ✅ Structure everything for admin panel management

## Step 1: Run the Migration

```bash
cd server
node scripts/fullCourseMigration.js
```

You should see output like:
```
🚀 Starting full course migration to Firebase...

📚 Migrating course: AI/ML Mastery...
✅ Successfully migrated: AI/ML Mastery
   - 1 module(s)
   - 2 lesson(s)

📚 Migrating course: Data Analytics...
✅ Successfully migrated: Data Analytics
   - 1 module(s)
   - 1 lesson(s)

📚 Migrating course: MERN Stack Development...
✅ Successfully migrated: MERN Stack Development
   - 1 module(s)
   - 1 lesson(s)

✅ All courses migrated successfully!
```

## Step 2: Verify in Firebase Console

1. Go to https://console.firebase.google.com/
2. Select your project
3. Go to **Firestore Database**
4. Check `courses` collection
5. You should see 3 documents (IDs: 1, 2, 3)
6. Click on each to see the structure:
   - Basic course info (title, description, etc.)
   - `modules` array with weeks
   - Each module has `lessons` array
   - Each lesson has content, type, etc.

## Step 3: Test Frontend

### Courses Page
1. Go to `http://localhost:5173/courses` (or your frontend URL)
2. You should see 3 courses displayed
3. Click on "AI/ML Mastery"
4. Should load the course detail page
5. Should show Week 1 with lessons

### Course Detail
- Should display course info
- Should show modules/weeks
- Should be able to expand weeks
- Should show lessons inside

## Step 4: Test Admin Panel

### View Courses
1. Go to `/admin/courses`
2. You should see 3 courses
3. Each shows title, category, difficulty

### Manage Course Content
1. Click on "AI/ML Mastery"
2. You should see:
   - Course title at top
   - "Add Week" button
   - Week 1 displayed
   - Lessons inside Week 1

### Add New Week
1. Click "Add Week"
2. Fill in:
   - Title: "Week 2: Data Types"
   - Description: "Learn about Python data types"
3. Click "Save"
4. New week appears in list

### Add Content to Week
1. Expand Week 2
2. Click "Add Article"
3. Fill in:
   - Title: "Introduction to Lists"
   - Content: Write markdown content
   - Difficulty: Easy
   - Points: 10
4. Click "Save"
5. Article appears in Week 2

### Edit Content
1. Click edit icon on any lesson
2. Modify the content
3. Click "Save"
4. Changes reflected immediately

### Delete Content
1. Click delete icon on any lesson
2. Confirm deletion
3. Content removed from Firebase

### Delete Week
1. Click delete icon on any week
2. Confirm deletion
3. Week and all its content removed

## Step 5: Verify Changes in Frontend

1. Go back to `/courses/1`
2. Refresh the page
3. Should see your new Week 2
4. Should see your new article
5. Changes from admin panel are live!

---

## What's Included in Migration

### AI/ML Mastery (Course ID: 1)
- **Week 1: Getting Started with Python**
  - Lesson 1: Week 1 Course Plan (full markdown)
  - Lesson 2: Day 1 Introduction & Python Setup (full markdown)

### Data Analytics (Course ID: 2)
- **Week 1: Introduction to Data Analytics**
  - Lesson 1: What is Data Analytics? (full markdown)

### MERN Stack (Course ID: 3)
- **Week 1: Introduction to MERN Stack**
  - Lesson 1: What is MERN Stack? (full markdown)

---

## Admin Panel Capabilities

After migration, you can:

### ✅ Course Management
- View all courses
- Click to manage content
- See course statistics

### ✅ Week/Module Management
- Add new weeks
- Edit week details
- Delete weeks
- Reorder weeks (via order field)

### ✅ Content Management
- **Add Articles** - Markdown content with images
- **Add Problems** - Coding challenges (future)
- **Add Quizzes** - MCQ questions (future)
- Edit any content
- Delete any content
- Upload images for articles

### ✅ Real-time Updates
- Changes save to Firebase immediately
- Frontend reflects changes on refresh
- No deployment needed for content updates

---

## Expanding Course Content

### To Add More Weeks:
1. Go to `/admin/courses`
2. Click on course
3. Click "Add Week"
4. Fill in details
5. Save

### To Add More Lessons:
1. Expand a week
2. Click "Add Article" (or Problem/Quiz)
3. Write content in markdown
4. Add images if needed
5. Save

### To Import Existing Content:
If you have existing course content in markdown files:
1. Copy the markdown
2. Use admin panel to create lesson
3. Paste markdown into content field
4. Save

---

## Troubleshooting

### Migration Fails
- Check Firebase credentials in `serviceAccountKey.json`
- Ensure Firebase Admin SDK is initialized
- Check console for error messages

### Courses Don't Show on Frontend
- Check browser console for errors
- Verify API is running
- Check Firebase has data
- Clear browser cache

### Admin Panel Can't Edit
- Verify you're logged in as admin
- Check Firebase security rules
- Check browser console for errors

### Changes Don't Appear
- Refresh the page
- Check Firebase Console to verify data saved
- Clear browser cache

---

## Firebase Structure After Migration

```
courses/
├── 1/
│   ├── title: "AI/ML Mastery"
│   ├── description: "..."
│   ├── category: "AI/ML"
│   ├── difficulty: "Advanced"
│   ├── duration: "24 weeks"
│   ├── instructor: "Muntazir Mehdi & Keshav Kashyap"
│   ├── modules: [
│   │   {
│   │     id: "week_...",
│   │     title: "Week 1: Getting Started with Python",
│   │     order: 1,
│   │     lessons: [
│   │       {
│   │         id: "lesson_...",
│   │         title: "Week 1: Course Plan",
│   │         type: "article",
│   │         content: "# Week 1...",
│   │         difficulty: "Easy",
│   │         points: 10,
│   │         order: 1
│   │       }
│   │     ]
│   │   }
│   │ ]
│   └── timestamps
├── 2/ (Data Analytics)
└── 3/ (MERN Stack)
```

---

## Next Steps

1. **Run the migration** - Execute the script
2. **Verify in Firebase** - Check data is there
3. **Test frontend** - Browse courses
4. **Test admin panel** - Add/edit/delete content
5. **Expand content** - Add more weeks and lessons
6. **Customize** - Modify existing content as needed

---

## Important Notes

- ✅ All changes through admin panel save to Firebase
- ✅ Frontend always fetches latest from Firebase
- ✅ No code deployment needed for content changes
- ✅ You can add unlimited weeks and lessons
- ✅ Markdown support for rich content
- ✅ Image upload support via Cloudinary

---

**Ready to migrate? Run the command and let's get your courses into Firebase!** 🚀
