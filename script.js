// Service Categories Data
const services = [
    {
        name: "AC Repair",
        description: "Expert AC installation & repair",
        icon: "❄️",
        color: "#E0F2FE"
    },
    {
        name: "Refrigerator Repair",
        description: "Professional fridge repair & maintenance",
        icon: "🧊",
        color: "#F0F9FF"
    },
    {
        name: "Electrician",
        description: "Electrical repairs and installations",
        icon: "⚡",
        color: "#FEFCE8"
    },
    {
        name: "Washing Machine Repair",
        description: "Expert washing machine service & repair",
        icon: "🌀",
        color: "#F0FDF4"
    },
    {
        name: "Microwave Repair",
        description: "Microwave oven repair & servicing",
        icon: "📡",
        color: "#FDF2F8"
    },
    {
        name: "Household Technician",
        description: "All-in-one home appliance technician",
        icon: "🔧",
        color: "#FFF7ED"
    },
    {
        name: "Solar Panel Repair",
        description: "Solar panel installation & maintenance",
        icon: "☀️",
        color: "#FEFCE8"
    },
    {
        name: "CCTV Repair",
        description: "CCTV installation, repair & maintenance",
        icon: "📹",
        color: "#F5F3FF"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderServices();
    setupSearch();
    setupSmoothScroll();
    addAnimationOnScroll();
    setupAuth();
    updateNavBar();
});

// Render service cards
function renderServices() {
    const serviceGrid = document.getElementById('serviceGrid');
    if (!serviceGrid) return;

    serviceGrid.innerHTML = services.map(service => `
        <div class="service-card" data-service="${service.name.toLowerCase()}">
            <div class="service-icon" style="background-color: ${service.color};">
                ${service.icon}
            </div>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
        </div>
    `).join('');

    // Add click handlers to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceName = this.getAttribute('data-service');
            handleServiceClick(serviceName);
        });
    });
}

// Authentication functions
function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

function setAuthenticated(value, userData = null) {
    localStorage.setItem('isAuthenticated', value);
    if (userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
    }
    updateNavBar();
}

function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Handle service card click
function handleServiceClick(serviceName) {
    // Check if user is authenticated
    if (!isAuthenticated()) {
        // Store the service name to navigate after sign in
        sessionStorage.setItem('pendingService', serviceName);
        // Show sign in modal
        showSignInModal();
        return;
    }
    
    // Navigate to service details page
    const serviceSlug = serviceName.toLowerCase().replace(/\s+/g, '-');
    window.location.href = `service-details.html?service=${serviceSlug}`;
}

// Show sign in modal
function showSignInModal() {
    const modal = document.getElementById('signInModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Hide sign in modal
function hideSignInModal() {
    const modal = document.getElementById('signInModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Update navigation bar based on auth status
function updateNavBar() {
    const signInBtn = document.getElementById('signInBtn');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    
    if (isAuthenticated()) {
        const userData = getUserData();
        if (signInBtn) signInBtn.style.display = 'none';
        if (getStartedBtn) getStartedBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (userName && userData) {
            userName.textContent = userData.name || userData.email;
        }
    } else {
        if (signInBtn) signInBtn.style.display = 'inline-block';
        if (getStartedBtn) getStartedBtn.style.display = 'inline-block';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        // Search on button click
        searchBtn.addEventListener('click', performSearch);
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Real-time search filtering (optional)
        searchInput.addEventListener('input', function() {
            filterServices(this.value);
        });
    }
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim().toLowerCase();
    
    if (query) {
        // Filter services based on search query
        filterServices(query);
        
        // Scroll to services section
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // Show all services if search is empty
        renderServices();
    }
}

// Filter services based on search query
function filterServices(query) {
    const serviceCards = document.querySelectorAll('.service-card');
    let hasResults = false;
    
    serviceCards.forEach(card => {
        const serviceName = card.getAttribute('data-service');
        const cardText = card.textContent.toLowerCase();
        
        if (cardText.includes(query) || serviceName.includes(query)) {
            card.style.display = 'block';
            hasResults = true;
            
            // Add highlight animation
            card.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                card.style.animation = '';
            }, 500);
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show message if no results
    const serviceGrid = document.getElementById('serviceGrid');
    if (!hasResults && query) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-secondary);';
        noResults.innerHTML = `
            <p style="font-size: 18px; margin-bottom: 8px;">No services found</p>
            <p style="font-size: 14px;">Try searching for something else</p>
        `;
        
        // Remove existing no-results message
        const existing = serviceGrid.querySelector('.no-results');
        if (existing) existing.remove();
        
        serviceGrid.appendChild(noResults);
    } else {
        const existing = serviceGrid.querySelector('.no-results');
        if (existing) existing.remove();
    }
}

// Setup smooth scroll for navigation links
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Add animation on scroll
function addAnimationOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe step cards
    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });
}

// Current user type (customer or technician)
let currentUserType = 'customer';

// Setup authentication
function setupAuth() {
    // Sign in button
    const signInBtn = document.getElementById('signInBtn');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const signInForm = document.getElementById('signInForm');
    const closeModal = document.getElementById('closeModal');
    const signOutBtn = document.getElementById('signOutBtn');
    const signUpBtn = document.getElementById('signUpBtn');
    const customerTab = document.getElementById('customerTab');
    const technicianTab = document.getElementById('technicianTab');
    
    // User type tab switching
    if (customerTab) {
        customerTab.addEventListener('click', function() {
            switchUserType('customer');
        });
    }
    
    if (technicianTab) {
        technicianTab.addEventListener('click', function() {
            switchUserType('technician');
        });
    }
    
    // Open modal
    if (signInBtn) {
        signInBtn.addEventListener('click', showSignInModal);
    }
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', showSignInModal);
    }
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', hideSignInModal);
    }
    
    // Close modal on overlay click
    const modal = document.getElementById('signInModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideSignInModal();
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideSignInModal();
        }
    });
    
    // Handle sign in form submission
    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignIn();
        });
    }
    
    // Sign out
    if (signOutBtn) {
        signOutBtn.addEventListener('click', function() {
            setAuthenticated(false);
            localStorage.removeItem('userData');
            updateNavBar();
        });
    }
    
    // Sign up button (for demo, just signs in)
    if (signUpBtn) {
        signUpBtn.addEventListener('click', function() {
            // For demo purposes, create account and sign in
            const email = document.getElementById('email').value || 'user@example.com';
            const name = email.split('@')[0];
            setAuthenticated(true, { email, name, userType: currentUserType });
            hideSignInModal();
            handlePostSignIn();
        });
    }
    
    // Technician registration button
    const registerTechBtn = document.getElementById('registerTechBtn');
    const registerTechModal = document.getElementById('registerTechModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const registerTechForm = document.getElementById('registerTechForm');
    
    // Open registration modal
    if (registerTechBtn) {
        registerTechBtn.addEventListener('click', function() {
            showRegisterTechModal();
        });
    }
    
    // Close registration modal
    if (closeRegisterModal) {
        closeRegisterModal.addEventListener('click', hideRegisterTechModal);
    }
    
    // Close modal on overlay click
    if (registerTechModal) {
        registerTechModal.addEventListener('click', function(e) {
            if (e.target === registerTechModal) {
                hideRegisterTechModal();
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && registerTechModal && registerTechModal.style.display === 'flex') {
            hideRegisterTechModal();
        }
    });
    
    // Handle registration form submission
    if (registerTechForm) {
        registerTechForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleTechRegistration();
        });
    }
    
    // Mobile number validation for registration
    const techMobileInput = document.getElementById('techMobile');
    if (techMobileInput) {
        techMobileInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// Show technician registration modal
function showRegisterTechModal() {
    const modal = document.getElementById('registerTechModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Hide technician registration modal
function hideRegisterTechModal() {
    const modal = document.getElementById('registerTechModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Handle technician registration
function handleTechRegistration() {
    const formData = {
        name: document.getElementById('techName').value.trim(),
        mobile: document.getElementById('techMobile').value.trim(),
        experience: document.getElementById('techExperience').value,
        work: document.getElementById('techWork').value,
        location: document.getElementById('techLocation').value,
        email: document.getElementById('techEmail').value.trim(),
        registrationDate: new Date().toISOString()
    };
    
    // Validate mobile number
    if (formData.mobile.length !== 10) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }
    
    // Validate required fields
    if (!formData.name || !formData.mobile || !formData.experience || !formData.work || !formData.location || !formData.email) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Save registration data
    const registrations = JSON.parse(localStorage.getItem('technicianRegistrations') || '[]');
    registrations.push({
        ...formData,
        id: Date.now().toString(),
        status: 'pending'
    });
    localStorage.setItem('technicianRegistrations', JSON.stringify(registrations));
    
    // Show success message
    alert('Registration submitted successfully! We will review your application and contact you shortly.');
    
    // Reset form
    document.getElementById('registerTechForm').reset();
    
    // Close modal
    hideRegisterTechModal();
}

// Switch user type
function switchUserType(userType) {
    currentUserType = userType;
    const customerTab = document.getElementById('customerTab');
    const technicianTab = document.getElementById('technicianTab');
    const signInButtonText = document.getElementById('signInButtonText');
    
    if (customerTab && technicianTab) {
        if (userType === 'customer') {
            customerTab.classList.add('active');
            technicianTab.classList.remove('active');
        } else {
            technicianTab.classList.add('active');
            customerTab.classList.remove('active');
        }
    }
    
    if (signInButtonText) {
        signInButtonText.textContent = `Sign In as ${userType === 'customer' ? 'Customer' : 'Technician'}`;
    }
}

// Handle sign in
function handleSignIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Simple validation (in real app, this would call an API)
    if (email && password) {
        // For demo purposes, accept any email/password
        const name = email.split('@')[0];
        setAuthenticated(true, { email, name, userType: currentUserType });
        hideSignInModal();
        handlePostSignIn();
    } else {
        alert('Please enter both email and password');
    }
}

// Handle post sign in navigation
function handlePostSignIn() {
    const userData = getUserData();
    
    // If technician, redirect to dashboard
    if (userData && userData.userType === 'technician') {
        window.location.href = 'technician-dashboard.html';
        return;
    }
    
    // Check if there's a pending service to navigate to
    const pendingService = sessionStorage.getItem('pendingService');
    if (pendingService) {
        sessionStorage.removeItem('pendingService');
        const serviceSlug = pendingService.toLowerCase().replace(/\s+/g, '-');
        window.location.href = `service-details.html?service=${serviceSlug}`;
    }
}

// Add pulse animation for CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);

