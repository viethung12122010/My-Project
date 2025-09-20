// Main page (web.html) JavaScript functionality

function initializeMainPage() {
    // Slit overlay animation
    document.body.style.opacity = "0";
    setTimeout(function () {
        document.getElementById('slit-overlay').classList.add('hide');
    }, 200);
    setTimeout(function () {
        document.getElementById('slit-overlay').style.display = "none";
        document.body.style.opacity = "1";
    }, 1400);

    // User status management
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    const userStatusContainer = document.getElementById('user-status-container');
    // const avatarLink = document.getElementById('avatar-link'); // Removed, handled by common.js
    // const avatarImg = document.getElementById('avatar-img'); // Removed, handled by common.js

    const logoutButtonHtml = `
        <button id="logout-btn" class="sign-btn">Sign Out</button>
    `;

    if (currentUser) {
        // avatarImg.src = currentUser.avatar || '../asset/image/Material/user.jpg'; // Removed, handled by common.js
        // avatarLink.href = '/html/profile.html'; // Removed, handled by common.js
        userStatusContainer.innerHTML = logoutButtonHtml;
    } else {
        // avatarImg.src = '../asset/image/Material/user.jpg'; // Removed, handled by common.js
        // avatarLink.href = '#'; // Removed, handled by common.js
        userStatusContainer.innerHTML = `
            <a href="#" class="sign-btn" data-bs-toggle="modal" data-bs-target="#signInModal">Login</a>
            <a href="#sign_up" class="sign-btn">Register</a>
        `;
    }

    // Logout functionality
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('current_user');
            window.location.reload();
        });
    }

    // Sign-in form handling
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleSignIn();
        });
    }

    // Check if we need to open the sign-in modal
    if (localStorage.getItem('openSignInModal') === 'true') {
        const signInModal = new bootstrap.Modal(document.getElementById('signInModal'));
        signInModal.show();
        localStorage.removeItem('openSignInModal');
    }
}

async function handleSignIn() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('login-message');
    
    try {
        const response = await fetch('/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('current_user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            messageDiv.textContent = '';
            window.location.reload();
        } else {
            messageDiv.textContent = data.error || 'Invalid email or password.';
        }
    } catch (error) {
        console.error('Login error:', error);
        messageDiv.textContent = 'An error occurred during login.';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeMainPage();
    CommonJS.initializeCommon();
});