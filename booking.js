// Check authentication
function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

// Get technician data from URL or sessionStorage
function getTechnicianData() {
    const params = new URLSearchParams(window.location.search);
    const techId = params.get('techId');
    const techName = params.get('name');
    const techRating = params.get('rating');
    const techExperience = params.get('experience');
    const techPrice = params.get('price');
    const techImage = params.get('image');
    
    if (techId) {
        return {
            id: techId,
            name: decodeURIComponent(techName || ''),
            rating: parseFloat(techRating || 0),
            experience: decodeURIComponent(techExperience || ''),
            price: parseInt(techPrice || 0),
            image: decodeURIComponent(techImage || '👨‍🔧')
        };
    }
    
    // Fallback to sessionStorage
    const stored = sessionStorage.getItem('selectedTechnician');
    if (stored) {
        return JSON.parse(stored);
    }
    
    return null;
}

// Go back function
function goBack() {
    const referrer = document.referrer;
    if (referrer && referrer.includes('service-details.html')) {
        window.history.back();
    } else {
        window.location.href = 'service-details.html';
    }
}

// Go to tracking page
function goToTracking() {
    window.location.href = 'tracking.html';
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update user menu
    updateUserMenu();
    
    // Load technician data
    const techData = getTechnicianData();
    if (techData) {
        displayTechnicianSummary(techData);
    } else {
        // Redirect if no technician data
        window.location.href = 'service-details.html';
        return;
    }
    
    // Setup form
    setupBookingForm(techData);
});

// Update user menu
function updateUserMenu() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userName = document.getElementById('userName');
    const signOutBtn = document.getElementById('signOutBtn');
    
    if (userName && userData.name) {
        userName.textContent = userData.name;
    }
    
    if (signOutBtn) {
        signOutBtn.addEventListener('click', function() {
            localStorage.setItem('isAuthenticated', 'false');
            localStorage.removeItem('userData');
            window.location.href = 'index.html';
        });
    }
}

// Display technician summary
function displayTechnicianSummary(techData) {
    const summaryAvatar = document.getElementById('summaryAvatar');
    const summaryName = document.getElementById('summaryName');
    const summaryRating = document.getElementById('summaryRating');
    const summaryExperience = document.getElementById('summaryExperience');
    const summaryPrice = document.getElementById('summaryPrice');
    
    if (summaryAvatar) {
        summaryAvatar.textContent = techData.image || '👨‍🔧';
    }
    
    if (summaryName) {
        summaryName.textContent = techData.name || 'Technician';
    }
    
    if (summaryRating) {
        const stars = '★'.repeat(Math.floor(techData.rating)) + '☆'.repeat(5 - Math.floor(techData.rating));
        summaryRating.innerHTML = `
            <span class="rating-stars">${stars}</span>
            <span class="rating-value">${techData.rating}</span>
        `;
    }
    
    if (summaryExperience) {
        summaryExperience.textContent = `Experience: ${techData.experience}`;
    }
    
    if (summaryPrice) {
        summaryPrice.textContent = `₹${techData.price}`;
    }
}

// Setup booking form
function setupBookingForm(techData) {
    const bookingForm = document.getElementById('bookingForm');
    const mobileInput = document.getElementById('mobileNumber');
    
    // Mobile number validation (only numbers)
    if (mobileInput) {
        mobileInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    
    // Form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBookingSubmission(techData);
        });
    }
}

// Handle booking submission
function handleBookingSubmission(techData) {
    const formData = {
        technicianId: techData.id,
        technicianName: techData.name,
        customerName: document.getElementById('customerName').value.trim(),
        mobileNumber: document.getElementById('mobileNumber').value.trim(),
        address: document.getElementById('address').value.trim(),
        landmark: document.getElementById('landmark').value.trim(),
        preferredTime: document.getElementById('preferredTime').value,
        servicePrice: techData.price,
        bookingDate: new Date().toISOString()
    };
    
    // Validate mobile number
    if (formData.mobileNumber.length !== 10) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }
    
    // Validate required fields
    if (!formData.customerName || !formData.mobileNumber || !formData.address) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Store booking data
    sessionStorage.setItem('bookingData', JSON.stringify(formData));
    
    // Also save to localStorage for bookings history
    saveBookingToHistory(formData);
    
    // Show success message and redirect
    showBookingSuccess(formData);
}

// Save booking to history
function saveBookingToHistory(bookingData) {
    try {
        const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        const newBooking = {
            id: Date.now().toString(),
            bookingNumber: 'BK' + Math.floor(100000 + Math.random() * 900000),
            technicianName: bookingData.technicianName,
            technicianId: bookingData.technicianId,
            serviceType: 'Home Service', // You can extract from URL or form
            servicePrice: bookingData.servicePrice,
            customerName: bookingData.customerName,
            mobileNumber: bookingData.mobileNumber,
            address: bookingData.address,
            landmark: bookingData.landmark || '',
            preferredTime: bookingData.preferredTime || '',
            status: 'active',
            bookingDate: bookingData.bookingDate || new Date().toISOString(),
            completedDate: null,
            rating: null,
            review: null
        };
        existingBookings.unshift(newBooking);
        localStorage.setItem('userBookings', JSON.stringify(existingBookings));
    } catch (e) {
        console.error('Error saving booking to history:', e);
    }
}

// Show booking success
function showBookingSuccess(bookingData) {
    // Create success modal
    const successModal = document.createElement('div');
    successModal.className = 'success-modal-overlay';
    successModal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="32" fill="#10B981"/>
                    <path d="M20 32L28 40L44 24" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h2>Booking Confirmed!</h2>
            <p>Your booking has been successfully submitted.</p>
            <div class="booking-details">
                <div class="detail-row">
                    <span class="detail-label">Technician:</span>
                    <span class="detail-value">${bookingData.technicianName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Service Charge:</span>
                    <span class="detail-value">₹${bookingData.servicePrice}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Contact:</span>
                    <span class="detail-value">${bookingData.mobileNumber}</span>
                </div>
            </div>
            <p class="success-message">
                The technician will contact you shortly at <strong>${bookingData.mobileNumber}</strong> 
                to confirm the appointment and visit your address.
            </p>
            <div class="success-actions">
                <button class="btn-primary" onclick="goToTracking()">
                    Track Service
                </button>
                <button class="btn-secondary" onclick="window.location.href='index.html'">
                    Back to Home
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(successModal);
    
    // Animate in
    setTimeout(() => {
        successModal.style.opacity = '1';
    }, 10);
}

