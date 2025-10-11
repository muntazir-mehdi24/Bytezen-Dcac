# Progress Components Documentation

## ProgressTab Component

### Location
`/client/src/components/course/ProgressTab.jsx`

### Purpose
Displays a student's personal progress dashboard with detailed analytics for a specific course.

### Props
- `courseId` (string, required): The ID of the course to display progress for

### Features
- Overall progress overview with key metrics
- Category-wise breakdown (Articles, Problems, Quizzes)
- Weekly progress tracking
- Streak information and motivation
- Recent activity lists
- Time tracking analytics

### Usage
```jsx
import ProgressTab from '../../components/course/ProgressTab';

<ProgressTab courseId="course-id-here" />
```

### Data Structure
The component fetches data from `/api/progress/:courseId/detailed` which returns:
```javascript
{
  overall: {
    progress: Number,      // 0-100
    timeSpent: Number,     // seconds
    points: Number,
    streak: Number,        // days
    longestStreak: Number  // days
  },
  articles: {
    completed: Number,
    list: Array
  },
  problems: {
    completed: Number,
    totalPoints: Number,
    list: Array
  },
  quizzes: {
    completed: Number,
    averageScore: Number,
    list: Array
  },
  weeks: Array,
  days: Array
}
```

### Styling
- Uses Tailwind CSS
- Color scheme: Green (#2f8d46) for primary actions
- Responsive design with mobile-first approach
- Icons from react-icons/fa

---

## StudentProgressDashboard Component

### Location
`/client/src/pages/admin/StudentProgressDashboard.jsx`

### Purpose
Admin/Instructor dashboard to view and manage all students' progress in a course.

### Props
- `courseId` (string, required): The ID of the course to display student progress for

### Features
- **List View**:
  - Searchable student list
  - Sortable columns (progress, points, time, name)
  - Summary statistics
  - Quick progress indicators
  
- **Detail View**:
  - Individual student's complete progress
  - Activity breakdown by category
  - Detailed completion lists
  - Time and points analytics

### Usage
```jsx
import StudentProgressDashboard from '../admin/StudentProgressDashboard';

<StudentProgressDashboard courseId="course-id-here" />
```

### API Endpoints Used
1. `GET /api/progress/admin/course/:courseId` - Get all students
2. `GET /api/progress/admin/student/:userId/:courseId` - Get student details

### Data Structure
**Student List:**
```javascript
[{
  user: {
    _id: String,
    name: String,
    email: String,
    profilePicture: String
  },
  overallProgress: Number,
  articlesCompleted: Number,
  problemsCompleted: Number,
  quizzesCompleted: Number,
  totalPoints: Number,
  timeSpent: Number,
  currentStreak: Number,
  lastAccessed: Date,
  enrolledAt: Date
}]
```

### Search & Filter
- **Search**: Filters by student name or email
- **Sort Options**:
  - By Progress (default)
  - By Points
  - By Time Spent
  - By Name (alphabetical)

### Styling
- Table-based layout for list view
- Card-based layout for detail view
- Color-coded progress indicators
- Responsive design

---

## Integration in CourseDetail

### Location
`/client/src/pages/courses/CourseDetail.jsx`

### Implementation
The Progress tab is integrated into the course navigation:

```jsx
// Import components
import ProgressTab from '../../components/course/ProgressTab';
import StudentProgressDashboard from '../admin/StudentProgressDashboard';

// In the tabs section
<button
  onClick={() => setActiveTab('progress')}
  className={`py-4 px-1 border-b-2 font-medium text-sm ${
    activeTab === 'progress'
      ? 'border-[#2f8d46] text-[#2f8d46]'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
  }`}
>
  <FaChartLine className="inline mr-1" />
  PROGRESS
</button>

// In the content section
{activeTab === 'progress' && (
  <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
    {userProfile?.role === 'instructor' || userProfile?.role === 'admin' ? (
      <StudentProgressDashboard courseId={id} />
    ) : (
      <ProgressTab courseId={id} />
    )}
  </div>
)}
```

### Role-Based Rendering
- **Students**: See `ProgressTab` component
- **Instructors/Admins**: See `StudentProgressDashboard` component

---

## Helper Functions

### formatTime(seconds)
Converts seconds to human-readable format.

```javascript
const formatTime = (seconds) => {
  if (!seconds) return '0m';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};
```

**Examples:**
- `formatTime(300)` → "5m"
- `formatTime(3900)` → "1h 5m"

### formatDate(dateString)
Converts ISO date string to readable format.

```javascript
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};
```

**Example:**
- `formatDate('2025-10-11T13:16:52')` → "Oct 11, 2025"

### getProgressColor(progress)
Returns color class based on progress percentage.

```javascript
const getProgressColor = (progress) => {
  if (progress >= 80) return 'text-green-600';
  if (progress >= 50) return 'text-yellow-600';
  return 'text-red-600';
};
```

---

## State Management

### ProgressTab States
```javascript
const [loading, setLoading] = useState(true);
const [progressData, setProgressData] = useState(null);
const [error, setError] = useState(null);
```

### StudentProgressDashboard States
```javascript
const [loading, setLoading] = useState(true);
const [studentsProgress, setStudentsProgress] = useState([]);
const [filteredStudents, setFilteredStudents] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [selectedStudent, setSelectedStudent] = useState(null);
const [detailedProgress, setDetailedProgress] = useState(null);
const [error, setError] = useState(null);
const [sortBy, setSortBy] = useState('progress');
```

---

## Error Handling

Both components include comprehensive error handling:

1. **Loading State**: Shows spinner while fetching data
2. **Error State**: Displays error message with retry button
3. **Empty State**: Shows helpful message when no data exists
4. **API Error Handling**: Catches and displays API errors

### Example Error Display
```jsx
if (error) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p className="text-red-600">{error}</p>
      <button
        onClick={fetchProgressData}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );
}
```

---

## Performance Considerations

1. **Data Fetching**: Uses `useEffect` with proper dependencies
2. **Filtering**: Client-side filtering for instant search results
3. **Sorting**: Efficient array sorting with memoization potential
4. **Conditional Rendering**: Only renders active views
5. **Lazy Loading**: Can be enhanced with pagination for large student lists

---

## Accessibility

- Semantic HTML elements
- Proper ARIA labels (can be enhanced)
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

---

## Future Enhancements

1. **Pagination**: For large student lists
2. **Export**: CSV/PDF export functionality
3. **Charts**: Add visual charts using Chart.js or Recharts
4. **Real-time Updates**: WebSocket integration for live progress
5. **Filters**: Advanced filtering options
6. **Bulk Actions**: Select multiple students for bulk operations
7. **Notifications**: Alert system for low-performing students

---

## Troubleshooting

### Component Not Rendering
- Check that `courseId` prop is provided
- Verify user authentication
- Check browser console for errors

### Data Not Loading
- Verify API endpoints are accessible
- Check network tab for failed requests
- Ensure proper authentication headers

### Styling Issues
- Verify Tailwind CSS is properly configured
- Check for conflicting CSS classes
- Ensure all icon imports are correct

---

## Testing

### Unit Testing (Recommended)
```javascript
import { render, screen, waitFor } from '@testing-library/react';
import ProgressTab from './ProgressTab';

test('renders progress tab', async () => {
  render(<ProgressTab courseId="test-course-id" />);
  await waitFor(() => {
    expect(screen.getByText(/Your Progress Overview/i)).toBeInTheDocument();
  });
});
```

### Integration Testing
- Test with real API endpoints
- Verify role-based rendering
- Test search and filter functionality
- Verify navigation between views

---

## Dependencies

- React (hooks: useState, useEffect)
- react-icons/fa
- Tailwind CSS
- axios (via api.js)

---

## Support

For component-specific issues:
1. Check props are correctly passed
2. Verify API responses match expected structure
3. Check browser console for errors
4. Ensure all dependencies are installed
