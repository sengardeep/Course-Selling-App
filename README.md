# 🎓 Course Selling Platform

A modern, full-stack course selling platform built with Node.js, Express, MongoDB, and vanilla JavaScript. This platform allows instructors to create and manage courses while providing students with an intuitive interface to browse and purchase courses.

## ✨ Features

### 🔐 Authentication & Authorization
- **Dual Role System**: Separate authentication for Students and Instructors
- **Secure JWT Authentication**: Token-based authentication with role-based access control
- **Password Hashing**: Secure password storage using bcrypt
- **Protected Routes**: Middleware-based route protection

### 👨‍🎓 Student Features
- **User Registration & Login**: Secure account creation and authentication
- **Course Browsing**: View all available courses with detailed information
- **Real-time Search**: Search courses by title and description
- **Course Purchase**: One-click course purchasing system
- **Purchase History**: View all purchased courses in a dedicated section
- **Responsive Design**: Mobile-friendly interface

### 👨‍🏫 Instructor Features
- **Admin Dashboard**: Comprehensive statistics and analytics
- **Course Management**: Create, edit, and delete courses
- **Revenue Tracking**: Monitor earnings and student enrollment
- **Course Statistics**: View purchase counts and revenue per course
- **Professional Interface**: Clean, intuitive course management tools

### 🎨 Modern UI/UX
- **Beautiful Design**: Modern gradient-based color scheme
- **Smooth Animations**: Hover effects and transitions
- **Responsive Layout**: Works perfectly on all devices
- **Loading States**: Professional loading indicators
- **Alert System**: User-friendly notifications
- **Modal Dialogs**: Clean, accessible forms

## 🛠️ Tech Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **Zod**: Schema validation
- **dotenv**: Environment variable management

### Frontend
- **Vanilla JavaScript**: Pure JS for functionality
- **Modern CSS**: CSS Grid, Flexbox, Custom Properties
- **Responsive Design**: Mobile-first approach
- **Fetch API**: Modern HTTP client

## 📁 Project Structure

```
course-selling-app/
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Enhanced CSS with modern design
│   └── script.js           # JavaScript functionality
├── routes/
│   ├── admin.js            # Instructor routes
│   ├── user.js             # Student routes
│   └── course.js           # Course-related routes
├── middleware/
│   ├── admin.js            # Instructor authentication middleware
│   └── user.js             # Student authentication middleware
├── db.js                   # Database schemas and models
├── config.js               # Configuration and environment variables
├── index.js                # Main server file
├── package.json            # Dependencies and scripts
└── .env                    # Environment variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sengardeep/Course-Selling-App.git
   cd Course-Selling-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URL=mongodb+srv://your-connection-string
   JWT_ADMIN_SECRET=your-admin-secret
   JWT_USER_SECRET=your-user-secret
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 📱 Usage

### For Students
1. **Sign Up**: Create a new student account
2. **Browse Courses**: Explore available courses with search functionality
3. **Purchase Courses**: Buy courses with one-click purchasing
4. **View Purchases**: Access your course library

### For Instructors
1. **Admin Registration**: Create an instructor account
2. **Dashboard**: View comprehensive statistics
3. **Create Courses**: Add new courses with details and pricing
4. **Manage Courses**: Edit or delete existing courses
5. **Track Performance**: Monitor sales and revenue

## 🔧 API Endpoints

### Authentication
- `POST /user/signup` - Student registration
- `POST /user/signin` - Student login
- `POST /admin/signup` - Instructor registration
- `POST /admin/signin` - Instructor login

### Courses
- `GET /course/preview` - Get all courses (public)
- `POST /course/purchase` - Purchase a course (student only)
- `POST /admin/course` - Create a course (instructor only)
- `GET /admin/course` - Get instructor's courses with stats
- `PUT /admin/course` - Update a course (instructor only)

### User Actions
- `GET /user/purchases` - Get student's purchased courses

## 🎨 Design Features

- **Modern Color Palette**: Professional purple and green gradients
- **Smooth Animations**: Hover effects and transitions
- **Responsive Grid**: Adaptive course card layouts
- **Loading States**: Professional loading indicators
- **Modal System**: Clean, accessible dialogs
- **Search Functionality**: Real-time course filtering

## 🔒 Security Features

- **Password Hashing**: Secure bcrypt implementation
- **JWT Authentication**: Stateless token-based auth
- **Role-based Access**: Separate permissions for students/instructors
- **Input Validation**: Zod schema validation
- **CORS Configuration**: Proper cross-origin resource sharing

## 🚧 Work in Progress

The following features are currently under development or planned for future releases:

### 🔄 Current Development
- [ ] **Course Delete Functionality**: Complete implementation of course deletion
- [ ] **Course Edit Modal**: Frontend interface for editing existing courses
- [ ] **Advanced Search Filters**: Category-based filtering and sorting options
- [ ] **User Profile Management**: Edit profile information and preferences

### 🎯 Upcoming Features
- [ ] **Payment Gateway Integration**: Stripe/PayPal integration for real payments
- [ ] **Course Categories**: Organize courses into categories (Programming, Design, Business, etc.)
- [ ] **User Reviews & Ratings**: Allow students to rate and review courses
- [ ] **Course Progress Tracking**: Track student progress through course materials
- [ ] **Video Content Management**: Upload and stream course videos
- [ ] **Certificates**: Generate completion certificates for students
- [ ] **Discussion Forums**: Course-specific discussion boards
- [ ] **Wishlist Functionality**: Save courses for later purchase
- [ ] **Coupon System**: Discount codes and promotional offers
- [ ] **Email Notifications**: Automated emails for purchases and updates

### 🔧 Technical Improvements
- [ ] **Rate Limiting**: Implement API rate limiting for security
- [ ] **Caching Strategy**: Redis integration for improved performance
- [ ] **Image Upload**: Direct image upload for course thumbnails
- [ ] **Testing Suite**: Unit and integration tests
- [ ] **Docker Setup**: Containerized deployment
- [ ] **CI/CD Pipeline**: Automated testing and deployment

### 🎨 UI/UX Enhancements
- [ ] **Dark Mode**: Toggle between light and dark themes
- [ ] **Advanced Analytics**: Detailed charts and insights for instructors
- [ ] **Course Preview**: Video previews for courses
- [ ] **Mobile App**: React Native mobile application
- [ ] **Accessibility**: Enhanced screen reader support and keyboard navigation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Sengar Deep**
- GitHub: [@sengardeep](https://github.com/sengardeep)

---

⭐ **Star this repository if you found it helpful!**