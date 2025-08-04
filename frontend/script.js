// Global variables
let currentUser = null;
let currentUserType = null;
let authToken = null;
let coursesCache = [];
let purchasesCache = [];

// API base URL
const API_BASE = 'http://localhost:3000';

// DOM elements
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const courseModal = document.getElementById('courseModal');
const authButtons = document.getElementById('authButtons');
const userMenu = document.getElementById('userMenu');
const adminMenu = document.getElementById('adminMenu');

// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const showLoadingButton = (button, originalText) => {
    button.disabled = true;
    button.classList.add('loading');
    button.dataset.originalText = originalText;
};

const hideLoadingButton = (button) => {
    button.disabled = false;
    button.classList.remove('loading');
    if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
        delete button.dataset.originalText;
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
    loadCourses();
});

function initializeApp() {
    showSection('homeSection');
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
}

function setupEventListeners() {
    // Navigation
    document.getElementById('homeBtn').addEventListener('click', () => showSection('homeSection'));
    document.getElementById('coursesBtn').addEventListener('click', () => {
        showSection('coursesSection');
        loadCourses();
    });
    document.getElementById('browseCoursesBtn').addEventListener('click', () => {
        showSection('coursesSection');
        loadCourses();
    });

    // Auth buttons
    document.getElementById('loginBtn').addEventListener('click', () => showModal(loginModal));
    document.getElementById('signupBtn').addEventListener('click', () => showModal(signupModal));
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('adminLogoutBtn').addEventListener('click', logout);

    // User menu
    document.getElementById('myPurchasesBtn').addEventListener('click', () => {
        showSection('purchasesSection');
        loadUserPurchases();
    });

    // Admin menu
    document.getElementById('manageCourses').addEventListener('click', () => {
        showSection('adminSection');
        loadAdminCourses();
    });
    document.getElementById('addCourseBtn').addEventListener('click', () => {
        resetCourseForm();
        showModal(courseModal);
    });

    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('courseForm').addEventListener('submit', handleCourseSubmit);

    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            hideModal(modal);
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            hideModal(event.target);
        }
    });

    // Escape key to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                hideModal(modal);
            });
        }
    });
}

function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const userType = localStorage.getItem('userType');
    const userName = localStorage.getItem('userName');

    if (token && userType) {
        authToken = token;
        currentUserType = userType;
        currentUser = userName;
        updateUIForLoggedInUser();
    }
}

function updateUIForLoggedInUser() {
    authButtons.style.display = 'none';
    
    if (currentUserType === 'admin') {
        adminMenu.style.display = 'flex';
        userMenu.style.display = 'none';
        document.getElementById('adminName').textContent = `Admin: ${currentUser}`;
    } else {
        userMenu.style.display = 'flex';
        adminMenu.style.display = 'none';
        document.getElementById('userName').textContent = `Welcome, ${currentUser}!`;
    }
}

function updateUIForLoggedOutUser() {
    authButtons.style.display = 'flex';
    userMenu.style.display = 'none';
    adminMenu.style.display = 'none';
}

function showSection(sectionId) {
    // Hide all sections first
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the target section with animation
    setTimeout(() => {
        document.getElementById(sectionId).classList.add('active');
    }, 100);
}

function showModal(modal) {
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('show'), 10);
}

function hideModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

async function handleLogin(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    showLoadingButton(submitButton, originalText);
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;

    try {
        const response = await fetch(`${API_BASE}/${userType}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUserType = userType;
            currentUser = email.split('@')[0];
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('userType', userType);
            localStorage.setItem('userName', currentUser);

            updateUIForLoggedInUser();
            hideModal(loginModal);
            showAlert('Welcome back! Login successful.', 'success');
            
            // Reset form
            document.getElementById('loginForm').reset();
            
            // Clear caches
            coursesCache = [];
            purchasesCache = [];
        } else {
            showAlert(data.error || 'Login failed. Please check your credentials.', 'error');
        }
    } catch (error) {
        showAlert('Network error. Please check your connection and try again.', 'error');
    } finally {
        hideLoadingButton(submitButton);
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    showLoadingButton(submitButton, originalText);
    
    const firstName = document.getElementById('signupFirstName').value;
    const lastName = document.getElementById('signupLastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const userType = document.querySelector('input[name="signupUserType"]:checked').value;

    // Basic validation
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long.', 'error');
        hideLoadingButton(submitButton);
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/${userType}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Account created successfully! Please login to continue.', 'success');
            hideModal(signupModal);
            document.getElementById('signupForm').reset();
            
            // Pre-fill login form
            document.getElementById('loginEmail').value = email;
            document.querySelector(`input[name="userType"][value="${userType}"]`).checked = true;
            showModal(loginModal);
        } else {
            showAlert(data.error || 'Signup failed. Please try again.', 'error');
        }
    } catch (error) {
        showAlert('Network error. Please check your connection and try again.', 'error');
    } finally {
        hideLoadingButton(submitButton);
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    currentUserType = null;
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    
    updateUIForLoggedOutUser();
    showSection('homeSection');
    showAlert('Logged out successfully!', 'info');
}

async function loadCourses() {
    // Use cache if available and recent (5 minutes)
    if (coursesCache.length > 0 && coursesCache.timestamp && 
        Date.now() - coursesCache.timestamp < 300000) {
        displayCourses(coursesCache);
        return;
    }

    const coursesGrid = document.getElementById('coursesGrid');
    coursesGrid.innerHTML = '<div class="loading">Loading amazing courses for you...</div>';

    try {
        const response = await fetch(`${API_BASE}/course/preview`);
        const courses = await response.json();

        // Cache the courses
        coursesCache = courses;
        coursesCache.timestamp = Date.now();

        displayCourses(courses);
    } catch (error) {
        coursesGrid.innerHTML = '<div class="loading">😕 Unable to load courses. Please try again later.</div>';
    }
}

function displayCourses(courses) {
    const coursesGrid = document.getElementById('coursesGrid');
    coursesGrid.innerHTML = '';

    if (courses.length === 0) {
        coursesGrid.innerHTML = '<div class="loading">🎓 No courses available yet. Stay tuned for exciting content!</div>';
        return;
    }

    courses.forEach(course => {
        const courseCard = createCourseCard(course, 'public');
        coursesGrid.appendChild(courseCard);
    });
}

async function loadUserPurchases() {
    if (!authToken || currentUserType !== 'user') return;

    try {
        const response = await fetch(`${API_BASE}/user/purchases`, {
            headers: {
                'token': authToken,
            },
        });

        const data = await response.json();
        const purchasesGrid = document.getElementById('purchasesGrid');
        purchasesGrid.innerHTML = '';

        if (response.ok && data.courseData && data.courseData.length > 0) {
            data.courseData.forEach(course => {
                const courseCard = createCourseCard(course, 'purchased');
                purchasesGrid.appendChild(courseCard);
            });
        } else {
            purchasesGrid.innerHTML = '<p class="loading">No purchased courses yet.</p>';
        }
    } catch (error) {
        document.getElementById('purchasesGrid').innerHTML = '<p class="loading">Error loading purchases.</p>';
    }
}

async function loadAdminCourses() {
    if (!authToken || currentUserType !== 'admin') return;

    try {
        const response = await fetch(`${API_BASE}/admin/course`, {
            headers: {
                'token': authToken,
            },
        });

        const data = await response.json();
        const adminCoursesGrid = document.getElementById('adminCoursesGrid');
        const adminStats = document.getElementById('adminStats');
        
        adminCoursesGrid.innerHTML = '';
        adminStats.innerHTML = '';

        if (response.ok && data.courses && data.courses.length > 0) {
            // Display stats
            const totalCourses = data.courses.length;
            const totalStudents = data.courses.reduce((sum, course) => sum + (course.purchaseCount || 0), 0);
            const totalRevenue = data.courses.reduce((sum, course) => sum + (course.revenue || 0), 0);
            const avgRating = 4.7; // Mock rating

            adminStats.innerHTML = `
                <div class="stat-card">
                    <span class="stat-icon">📚</span>
                    <div class="stat-value">${totalCourses}</div>
                    <div class="stat-label">Total Courses</div>
                </div>
                <div class="stat-card">
                    <span class="stat-icon">👥</span>
                    <div class="stat-value">${totalStudents}</div>
                    <div class="stat-label">Total Students</div>
                </div>
                <div class="stat-card">
                    <span class="stat-icon">💰</span>
                    <div class="stat-value">$${totalRevenue.toFixed(2)}</div>
                    <div class="stat-label">Total Revenue</div>
                </div>
                <div class="stat-card">
                    <span class="stat-icon">⭐</span>
                    <div class="stat-value">${avgRating}</div>
                    <div class="stat-label">Avg Rating</div>
                </div>
            `;

            // Display courses
            data.courses.forEach(course => {
                const courseCard = createAdminCourseCard(course);
                adminCoursesGrid.appendChild(courseCard);
            });
        } else {
            adminStats.innerHTML = `
                <div class="stat-card">
                    <span class="stat-icon">🚀</span>
                    <div class="stat-value">0</div>
                    <div class="stat-label">Get Started</div>
                </div>
            `;
            adminCoursesGrid.innerHTML = '<div class="loading">📝 No courses created yet. Start by adding your first course!</div>';
        }
    } catch (error) {
        document.getElementById('adminCoursesGrid').innerHTML = '<div class="loading">😕 Error loading courses. Please try again.</div>';
    }
}

function createAdminCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    
    card.innerHTML = `
        <img src="${course.imageUrl}" alt="${course.title}" class="course-image" 
             onerror="this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&auto=format'">
        <div class="course-content">
            <h3 class="course-title">${course.title}</h3>
            <p class="course-description">${course.description}</p>
            <div class="course-meta">
                <div class="course-rating">
                    📈 ${course.purchaseCount || 0} sales
                </div>
                <div class="course-students">
                    💰 $${(course.revenue || 0).toFixed(2)} earned
                </div>
            </div>
            <div class="course-price">$${course.price}</div>
            <div class="course-actions">
                <button class="btn btn-outline" onclick="editCourse('${course._id}')">
                    ✏️ Edit
                </button>
                <button class="btn btn-danger" onclick="deleteCourse('${course._id}')">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function createCourseCard(course, type) {
    const card = document.createElement('div');
    card.className = 'course-card';
    
    const actions = getCardActions(course, type);
    const rating = Math.floor(Math.random() * 2) + 4; // Random rating between 4-5
    const students = Math.floor(Math.random() * 500) + 50; // Random students count
    
    card.innerHTML = `
        <img src="${course.imageUrl}" alt="${course.title}" class="course-image" 
             onerror="this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&auto=format'">
        <div class="course-content">
            <h3 class="course-title">${course.title}</h3>
            <p class="course-description">${course.description}</p>
            <div class="course-meta">
                <div class="course-rating">
                    ${'⭐'.repeat(rating)} ${rating}.${Math.floor(Math.random() * 10)}
                </div>
                <div class="course-students">
                    👥 ${students} students
                </div>
            </div>
            <div class="course-price">$${course.price}</div>
            <div class="course-actions">
                ${actions}
            </div>
        </div>
    `;
    
    // Add hover effect for cards
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
    
    return card;
}

function getCardActions(course, type) {
    switch (type) {
        case 'public':
            if (currentUserType === 'user') {
                return `<button class="btn btn-primary" onclick="purchaseCourse('${course._id}', this)">
                    💳 Purchase Course
                </button>`;
            }
            return `<button class="btn btn-outline" onclick="showAlert('Please login as a student to purchase courses', 'info')">
                🔒 Login to Purchase
            </button>`;
        
        case 'purchased':
            return `<button class="btn btn-success" disabled>
                ✅ Purchased
            </button>
            <button class="btn btn-outline" onclick="showAlert('Course access coming soon!', 'info')">
                📚 Access Course
            </button>`;
        
        case 'admin':
            return `
                <button class="btn btn-outline" onclick="editCourse('${course._id}')">
                    ✏️ Edit
                </button>
                <button class="btn btn-danger" onclick="deleteCourse('${course._id}')">
                    🗑️ Delete
                </button>
            `;
        
        default:
            return '';
    }
}

async function purchaseCourse(courseId, buttonElement) {
    if (!authToken || currentUserType !== 'user') {
        showAlert('Please login as a student to purchase courses', 'error');
        return;
    }

    const originalText = buttonElement.textContent;
    showLoadingButton(buttonElement, originalText);

    try {
        const response = await fetch(`${API_BASE}/course/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': authToken,
            },
            body: JSON.stringify({ courseId }),
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('🎉 Course purchased successfully! Check your purchases to access it.', 'success');
            
            // Update button to show purchased state
            buttonElement.innerHTML = '✅ Purchased';
            buttonElement.className = 'btn btn-success';
            buttonElement.disabled = true;
            
            // Clear purchases cache to force refresh
            purchasesCache = [];
        } else {
            showAlert(data.error || 'Purchase failed. Please try again.', 'error');
        }
    } catch (error) {
        showAlert('Network error. Please check your connection and try again.', 'error');
    } finally {
        hideLoadingButton(buttonElement);
    }
}

async function handleCourseSubmit(e) {
    e.preventDefault();
    
    if (!authToken || currentUserType !== 'admin') {
        showAlert('Admin access required', 'error');
        return;
    }

    const title = document.getElementById('courseTitle').value;
    const description = document.getElementById('courseDescription').value;
    const price = document.getElementById('coursePrice').value;
    const imageUrl = document.getElementById('courseImageUrl').value;

    const courseData = { title, description, price: Number(price), imageUrl };
    
    try {
        const response = await fetch(`${API_BASE}/admin/course`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': authToken,
            },
            body: JSON.stringify(courseData),
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Course created successfully!', 'success');
            courseModal.style.display = 'none';
            document.getElementById('courseForm').reset();
            loadAdminCourses();
        } else {
            showAlert(data.error || 'Failed to create course', 'error');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'error');
    }
}

function editCourse(courseId) {
    showAlert('Edit functionality will be implemented soon!', 'info');
}

async function deleteCourse(courseId) {
    if (!confirm('Are you sure you want to delete this course?')) return;

    showAlert('Delete functionality will be implemented soon!', 'info');
}

function resetCourseForm() {
    document.getElementById('courseForm').reset();
    document.getElementById('courseModalTitle').textContent = 'Add New Course';
}

function showAlert(message, type, duration = 5000) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; margin-left: auto; font-size: 1.2rem;">&times;</button>
    `;

    // Insert at the top of the main content
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(alert, mainContent.firstChild);

    // Auto remove after specified duration
    setTimeout(() => {
        if (alert.parentElement) {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-100%)';
            setTimeout(() => alert.remove(), 300);
        }
    }, duration);
}

// Search functionality
function addSearchFeature() {
    const coursesSection = document.getElementById('coursesSection');
    const container = coursesSection.querySelector('.container');
    
    const searchHTML = `
        <div class="search-container" style="margin-bottom: 2rem;">
            <div style="position: relative; max-width: 500px; margin: 0 auto;">
                <input type="text" id="courseSearch" placeholder="🔍 Search courses..." 
                       style="width: 100%; padding: 1rem 1rem 1rem 3rem; border: 2px solid var(--gray-300); border-radius: var(--border-radius-lg); font-size: 1rem;">
                <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--gray-500);">🔍</span>
            </div>
        </div>
    `;
    
    container.querySelector('h2').insertAdjacentHTML('afterend', searchHTML);
    
    // Add search functionality
    const searchInput = document.getElementById('courseSearch');
    searchInput.addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value.toLowerCase();
        const courseCards = document.querySelectorAll('#coursesGrid .course-card');
        
        courseCards.forEach(card => {
            const title = card.querySelector('.course-title').textContent.toLowerCase();
            const description = card.querySelector('.course-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }, 300));
}

// Call this when courses section is first loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addSearchFeature, 1000);
});
