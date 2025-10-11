# Backend Setup Guide - Real-Time Data Integration

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Variables
Create a `.env` file in the `server` directory:

```env
# Server
NODE_ENV=development
PORT=5001
CLIENT_URL=http://localhost:5173

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Firebase Admin
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_CLIENT_EMAIL=your_client_email

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Start Server
```bash
npm run dev
```

Server will run on `http://localhost:5001`

---

## 📡 API Endpoints

### **Student Management**
```
GET    /api/students              - Get all students
POST   /api/students              - Create student
GET    /api/students/:id          - Get student by ID
PUT    /api/students/:id          - Update student
DELETE /api/students/:id          - Delete student
```

**Request Body (POST/PUT):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "rollNumber": "CS2024001",
  "phone": "1234567890",
  "department": "Computer Science",
  "division": "A",
  "year": "SE"
}
```

---

### **Course Content Management**
```
GET    /api/courses                                    - Get all courses
GET    /api/courses/:courseId/content                  - Get course weeks
POST   /api/courses/:courseId/weeks                    - Add week
PUT    /api/courses/:courseId/weeks/:weekId            - Update week
DELETE /api/courses/:courseId/weeks/:weekId            - Delete week
POST   /api/courses/:courseId/weeks/:weekId/content    - Add content
PUT    /api/courses/:courseId/weeks/:weekId/content/:contentId - Update content
DELETE /api/courses/:courseId/weeks/:weekId/content/:contentId - Delete content
```

**Add Week (POST):**
```json
{
  "title": "Week 1: Introduction to Python",
  "description": "Learn Python basics",
  "duration": "7 days",
  "order": 1
}
```

**Add Content (POST with multipart/form-data):**
```
title: "Introduction to Variables"
type: "article" | "problem" | "quiz"
content: "# Markdown content here..."
duration: "30 min"
difficulty: "Easy" (for problems)
points: 10 (for problems)
images: [file1, file2] (optional, multiple files)
```

---

### **Events Management**
```
GET    /api/events           - Get all events
POST   /api/events           - Create event
PUT    /api/events/:id       - Update event
DELETE /api/events/:id       - Delete event
PATCH  /api/events/:id/toggle - Toggle publish status
```

**Request Body:**
```json
{
  "title": "AI Workshop",
  "description": "Learn AI basics",
  "date": "2024-12-01",
  "time": "10:00 AM",
  "location": "Main Hall",
  "eventType": "workshop",
  "mode": "offline",
  "registrationLink": "https://...",
  "maxParticipants": 100,
  "isPublished": true
}
```

---

### **ByteLog Management**
```
GET    /api/insights              - Get all bytelogs
POST   /api/insights              - Create bytelog
PUT    /api/insights/:id          - Update bytelog
DELETE /api/insights/:id          - Delete bytelog
PATCH  /api/insights/:id/publish  - Toggle publish
```

**Request Body:**
```json
{
  "title": "Getting Started with Python",
  "content": "# Markdown content...",
  "author": "John Doe",
  "tags": ["python", "tutorial"],
  "isPublished": true
}
```

---

### **Partners Management**
```
GET    /api/partners                    - Get active partners
POST   /api/partners                    - Add partner
PUT    /api/partners/:id                - Update partner
DELETE /api/partners/:id                - Delete partner
GET    /api/partners/requests           - Get form submissions
PUT    /api/partners/requests/:id/approve - Approve request
PUT    /api/partners/requests/:id/reject  - Reject request
```

---

### **Council Management**
```
GET    /api/council           - Get all members
POST   /api/council           - Add member
PUT    /api/council/:id       - Update member
DELETE /api/council/:id       - Delete member
PATCH  /api/council/:id/toggle - Toggle active status
```

**Request Body (multipart/form-data):**
```
name: "John Doe"
role: "President"
bio: "Description..."
email: "john@example.com"
linkedin: "https://linkedin.com/..."
twitter: "https://twitter.com/..."
github: "https://github.com/..."
isActive: true
image: [file]
```

---

### **Testimonials**
```
GET    /api/testimonials           - Get all testimonials
POST   /api/testimonials           - Create testimonial
PUT    /api/testimonials/:id       - Update testimonial
DELETE /api/testimonials/:id       - Delete testimonial
PATCH  /api/testimonials/:id/toggle - Toggle status
```

---

### **Progress Tracking**
```
GET    /api/progress/admin/course/:courseId - Get all students progress
GET    /api/progress/student/:userId        - Get student progress
POST   /api/progress/update                 - Update progress
```

---

### **Attendance**
```
GET    /api/attendance/course/:courseId     - Get course attendance
POST   /api/attendance/bulk                 - Mark bulk attendance
PUT    /api/attendance/:id                  - Update attendance
```

---

## 🗄️ Database Models

### **Student Model**
```javascript
{
  uid: String (unique),
  name: String,
  email: String (unique),
  rollNumber: String,
  phone: String,
  department: String,
  division: String,
  year: String,
  enrolledCourses: [{ courseId, enrolledAt }],
  role: String (default: 'student'),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **Course Model**
```javascript
{
  title: String,
  description: String,
  category: String,
  duration: String,
  level: String (Beginner/Intermediate/Advanced),
  instructor: String,
  image: String,
  modules: [{
    id: String,
    title: String,
    duration: String,
    lessons: [{
      id: String,
      title: String,
      type: String (article/problem/quiz),
      content: String,
      duration: String,
      difficulty: String,
      points: Number,
      completed: Boolean
    }]
  }],
  isPublished: Boolean,
  enrolledStudents: Number,
  rating: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🖼️ Image Upload

### **Cloudinary Setup**
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from Dashboard
3. Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **Upload Endpoints**
All endpoints that support image upload use `multipart/form-data`:
- Course Content: `images` field (multiple)
- Events: `image` field (single)
- ByteLogs: `thumbnail` field (single)
- Council: `image` field (single)
- Partners: `logo` field (single)

**Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('title', 'My Article');
formData.append('content', '# Content here');
formData.append('images', file1);
formData.append('images', file2);

await api.post('/courses/:id/weeks/:weekId/content', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

---

## 🔐 Authentication

All admin routes require authentication:

**Headers:**
```
Authorization: Bearer <firebase_token>
```

**Get Token (Frontend):**
```javascript
const token = await user.getIdToken();
```

---

## 🧪 Testing

### **Test Server:**
```bash
curl http://localhost:5001/api/test
```

### **Test Student API:**
```bash
# Get all students
curl http://localhost:5001/api/students \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create student
curl -X POST http://localhost:5001/api/students \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Computer Science"
  }'
```

---

## 📦 Dependencies

```json
{
  "express": "^5.1.0",
  "mongoose": "^8.19.1",
  "firebase-admin": "^13.5.0",
  "multer": "^1.4.5-lts.1",
  "cloudinary": "^2.0.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^3.0.2",
  "nodemailer": "^7.0.6"
}
```

---

## 🚨 Common Issues

### **CORS Error**
Add your frontend URL to `allowedOrigins` in `server.js`

### **MongoDB Connection Failed**
Check your `MONGODB_URI` in `.env`

### **Image Upload Failed**
Verify Cloudinary credentials in `.env`

### **Authentication Failed**
Ensure Firebase Admin SDK is properly configured

---

## 📝 Notes

1. **File Uploads:** Uploaded files are temporarily stored in `uploads/` folder and then uploaded to Cloudinary
2. **Image URLs:** All image URLs in responses are Cloudinary URLs
3. **Markdown:** Article content supports full Markdown syntax
4. **Auto-Insert Images:** Images uploaded with articles are automatically inserted at the end of the content

---

## 🎯 Next Steps

1. Set up Cloudinary account
2. Configure environment variables
3. Start the server
4. Test API endpoints
5. Connect frontend admin panel

**All admin modules are now connected to real-time database!** 🎉
