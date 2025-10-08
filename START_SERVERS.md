# 🚀 How to Start ByteZen Servers

## ⚠️ IMPORTANT: You Must Start Servers Manually

Due to the CORS error you're seeing, follow these steps **exactly**:

---

## Step 1: Start Backend Server

**Open a NEW terminal window** and run:

```bash
cd /Users/mac/Desktop/ByteZen-MERN/server
npm run dev
```

**Wait for this message:**
```
MongoDB connected
Server running in development mode on port 5000
```

✅ **Keep this terminal open!** Don't close it.

---

## Step 2: Start Frontend Server

**Open ANOTHER NEW terminal window** and run:

```bash
cd /Users/mac/Desktop/ByteZen-MERN/client
npm run dev
```

**Wait for:**
```
  ➜  Local:   http://localhost:5173/
```

✅ **Keep this terminal open too!**

---

## Step 3: Test in Browser

1. Go to: http://localhost:5173
2. Open browser console (F12)
3. You should NOT see CORS errors anymore
4. Try running code in a course

---

## 🐛 If You Still See CORS Errors

### Check Backend Terminal:
- Is it showing "Server running on port 5000"?
- Are there any error messages?

### Check Frontend Terminal:
- Is it showing "Local: http://localhost:5173"?

### Quick Fix:
1. Close BOTH terminals
2. Start backend first (wait for "Server running")
3. Then start frontend
4. Refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

---

## ✅ What Success Looks Like

**Backend Terminal:**
```
MongoDB connected
Server running in development mode on port 5000
```

**Frontend Terminal:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Browser Console:**
- No CORS errors
- No "Network Error" messages
- Code execution works!

---

## 🎯 Why Manual Start?

The automated start wasn't working because:
1. Environment variables need to be loaded fresh
2. MongoDB connection needs time to establish
3. CORS needs proper server initialization

**Manual start ensures everything loads correctly!**

---

## 📝 After Starting Successfully

Once both servers are running:
1. ✅ Authentication will work
2. ✅ Courses will load
3. ✅ Code execution will work
4. ✅ Progress tracking will work

**Start the servers now and let me know if you see any errors!**
