document.addEventListener('DOMContentLoaded', function () {
    const logoutButtonHtml = `
    <button id="logout-btn" class="sign-btn">Sign Out</button>
    `;

    // Function to handle smooth transition between pages
    function smoothTransition(url) {
        document.body.style.opacity = "0";
        setTimeout(function () {
            window.location.href = url;
        }, 500); // Wait for the fade-out animation to complete
    }

    // Check for current user and update UI
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    const userStatusContainer = document.getElementById('user-status-container');
    const avatarLink = document.getElementById('avatar-link');
    const avatarImg = document.getElementById('avatar-img');

    if (currentUser) {
        // If user is logged in, show avatar and logout button
        avatarImg.src = currentUser.avatar || '../asset/image/Material/user.jpg';
        avatarLink.href = 'profile.html';
        userStatusContainer.innerHTML = logoutButtonHtml;
    } else {
        // If user is not logged in, show login/register buttons
        avatarImg.src = '../asset/image/Material/user.jpg';
        avatarLink.href = '#'; // Prevent redirection
        userStatusContainer.innerHTML = `
            <a href="#" class="sign-btn" data-bs-toggle="modal" data-bs-target="#signInModal">Login</a>
            <a href="sign_up.html" class="sign-btn">Register</a>
        `;
        // If the user clicks on the avatar, open the sign-in modal
        avatarLink.addEventListener('click', (e) => {
            e.preventDefault();
            const signInModal = new bootstrap.Modal(document.getElementById('signInModal'));
            signInModal.show();
        });
    }

    // Add event listener for the logout button
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('current_user');
            localStorage.removeItem('token');
            window.location.reload();
        });
    }

    // Sign-in logic inside the modal
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const messageDiv = document.getElementById('login-message');
            
            try {
                const response = await fetch('http://localhost:4000/api/signin', {
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
        });
    }

    // Navigation logic for the overlay menu
    const navMenuButton = document.getElementById('navMenuButton');
    const navOverlay = document.getElementById('navOverlay');
    const closeNavButton = document.getElementById('closeNavButton');

    if(navMenuButton) {
        navMenuButton.addEventListener('click', () => {
            navOverlay.classList.add('show');
        });
    }

    if(closeNavButton) {
        closeNavButton.addEventListener('click', () => {
            navOverlay.classList.remove('show');
        });
    }

    if(navOverlay) {
        navOverlay.addEventListener('click', (e) => {
            if (e.target === navOverlay) {
                navOverlay.classList.remove('show');
            }
        });
    }

    // Logic to open sign-in modal if required
    if (localStorage.getItem('openSignInModal') === 'true') {
        const signInModal = new bootstrap.Modal(document.getElementById('signInModal'));
        signInModal.show();
        localStorage.removeItem('openSignInModal'); // Clean up the flag
    }
});