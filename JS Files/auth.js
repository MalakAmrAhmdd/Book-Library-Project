// Functionality for password visibility
document.addEventListener("DOMContentLoaded", () => {
    const toggleButtons = document.querySelectorAll('.togglePassword, .togglePassword-sign-up');

    toggleButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const passwordField = button.previousElementSibling;
            const icon = button.querySelector('.fa');

            const type = passwordField.type === 'password' ? 'text' : 'password';
            passwordField.type = type;

            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });
});

// validation function for sign-up
function validateSignUpForm() {
    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("Sign-up-pass")?.value.trim();
    const confirmPassword = document.getElementById("Sign-up-confirmPass")?.value.trim();

    // Check if all fields are filled
    if (!username || !password || !confirmPassword) {
        alert("All fields are required. Please fill them out.");
        return false;
    }

    // Check if username is at least 5 characters
    if (username.length < 5) {
        alert("Username must be at least 5 characters long.");
        return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return false;
    }

    return true;
}

// validation function for sign-in
function validateSignInForm() {
    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("pass")?.value.trim();

    // Check if all fields are filled
    if (!username || !password) {
        alert("Both username and password are required.");
        return false;
    }

    // Check if username is at least 5 characters
    if (username.length < 5) {
        alert("Username must be at least 5 characters long.");
        return false;
    }

    return true;
}

// Event listener for sign-up form submission
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("submit-sign-in");

    if (loginButton) {
        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const username = document.getElementById("username")?.value.trim();
            const password = document.getElementById("pass")?.value.trim();

            if (!validateSignInForm()) {
                return;
            }

            const response = await fetch('Users.json');
            
            const users = await response.json();

            const user = Object.values(users).find(
                user => user.username === username && user.password === password
            );

            if (user) {
                if (user.role === "admin") {
                    window.location.href = "Dashboard.html";
                } else {
                    window.location.href = "User_Homepage.html";
                }
            } else {
                alert("Invalid username or password. Please try again.");
            }
        });
    }
});